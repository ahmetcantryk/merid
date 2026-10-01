/**
 * Just enough of a WOFF2 reader to check what the shipped fonts contain: the cmap (which code points
 * have a glyph) and the fvar axes. No dependencies: WOFF2 tables are one Brotli stream, and neither
 * cmap nor fvar is ever transformed.
 */
import { brotliDecompressSync } from "node:zlib";

// WOFF2 spec, table 1: the 63 known table tags, indexed by the low six bits of the flags byte.
const KNOWN_TAGS: readonly string[] = [
  "cmap", "head", "hhea", "hmtx", "maxp", "name", "OS/2", "post", "cvt ", "fpgm", "glyf", "loca", "prep", "CFF ", "VORG", "EBDT",
  "EBLC", "gasp", "hdmx", "kern", "LTSH", "PCLT", "VDMX", "vhea", "vmtx", "BASE", "GDEF", "GPOS", "GSUB", "EBSC", "JSTF", "MATH",
  "CBDT", "CBLC", "COLR", "CPAL", "SVG ", "sbix", "acnt", "avar", "bdat", "bloc", "bsln", "cvar", "fdsc", "feat", "fmtx", "fvar",
  "gvar", "hsty", "just", "lcar", "mort", "morx", "opbd", "prop", "trak", "Zapf", "Silf", "Glat", "Gloc", "Feat", "Sill",
];

export interface Axis {
  readonly tag: string;
  readonly min: number;
  readonly default: number;
  readonly max: number;
}

export interface FontInfo {
  readonly hasGlyph: (codePoint: number) => boolean;
  readonly axes: readonly Axis[];
}

function base128(view: DataView, at: { pos: number }): number {
  let value = 0;
  for (let i = 0; i < 5; i += 1) {
    const byte = view.getUint8(at.pos);
    at.pos += 1;
    value = value * 128 + (byte & 0x7f);
    if ((byte & 0x80) === 0) return value;
  }
  throw new Error("woff2: UIntBase128 longer than 5 bytes");
}

/** Splits the decompressed table stream into tables by tag. */
function tables(file: Uint8Array): Map<string, DataView> {
  const view = new DataView(file.buffer, file.byteOffset, file.byteLength);
  if (view.getUint32(0) !== 0x774f4632) throw new Error("woff2: bad signature");
  const numTables = view.getUint16(12);
  const totalCompressedSize = view.getUint32(20);
  const at = { pos: 48 };
  const entries: { tag: string; length: number }[] = [];
  for (let i = 0; i < numTables; i += 1) {
    const flags = view.getUint8(at.pos);
    at.pos += 1;
    let tag = KNOWN_TAGS[flags & 0x3f];
    if ((flags & 0x3f) === 0x3f) {
      tag = String.fromCharCode(...file.subarray(at.pos, at.pos + 4));
      at.pos += 4;
    }
    if (!tag) throw new Error(`woff2: unknown tag index ${flags & 0x3f}`);
    const version = flags >> 6;
    const origLength = base128(view, at);
    // glyf/loca are transformed at version 0; every other table is transformed at any version but 0.
    const transformed = tag === "glyf" || tag === "loca" ? version !== 3 : version !== 0;
    const length = transformed ? base128(view, at) : origLength;
    entries.push({ tag, length });
  }
  const stream = brotliDecompressSync(file.subarray(at.pos, at.pos + totalCompressedSize));
  const out = new Map<string, DataView>();
  let offset = 0;
  for (const { tag, length } of entries) {
    out.set(tag, new DataView(stream.buffer, stream.byteOffset + offset, length));
    offset += length;
  }
  return out;
}

/** Code point -> glyph lookup from the Windows Unicode cmap subtable (format 12 preferred, else 4). */
function cmapLookup(cmap: DataView): (codePoint: number) => boolean {
  const count = cmap.getUint16(2);
  const subtables = Array.from({ length: count }, (_, i) => ({
    platform: cmap.getUint16(4 + i * 8),
    encoding: cmap.getUint16(6 + i * 8),
    offset: cmap.getUint32(8 + i * 8),
  }));
  const pick = subtables.find((s) => s.platform === 3 && s.encoding === 10) ?? subtables.find((s) => s.platform === 3 && s.encoding === 1);
  if (!pick) throw new Error("woff2: no Windows Unicode cmap");
  const at = pick.offset;
  const format = cmap.getUint16(at);
  if (format === 12) {
    const groups = cmap.getUint32(at + 12);
    return (cp) => {
      for (let g = 0; g < groups; g += 1) {
        const base = at + 16 + g * 12;
        if (cp >= cmap.getUint32(base) && cp <= cmap.getUint32(base + 4)) return cmap.getUint32(base + 8) + (cp - cmap.getUint32(base)) !== 0;
      }
      return false;
    };
  }
  if (format !== 4) throw new Error(`woff2: unsupported cmap format ${format}`);
  const segments = cmap.getUint16(at + 6) / 2;
  const ends = at + 14;
  const starts = ends + segments * 2 + 2;
  const deltas = starts + segments * 2;
  const rangeOffsets = deltas + segments * 2;
  return (cp) => {
    for (let s = 0; s < segments; s += 1) {
      if (cp > cmap.getUint16(ends + s * 2)) continue;
      const start = cmap.getUint16(starts + s * 2);
      if (cp < start) return false;
      const delta = cmap.getInt16(deltas + s * 2);
      const rangeOffset = cmap.getUint16(rangeOffsets + s * 2);
      if (rangeOffset === 0) return ((cp + delta) & 0xffff) !== 0;
      const glyph = cmap.getUint16(rangeOffsets + s * 2 + rangeOffset + (cp - start) * 2);
      return glyph !== 0 && ((glyph + delta) & 0xffff) !== 0;
    }
    return false;
  };
}

function fvarAxes(fvar: DataView | undefined): Axis[] {
  if (!fvar) return [];
  const offset = fvar.getUint16(4);
  const count = fvar.getUint16(8);
  const size = fvar.getUint16(10);
  const fixed = (at: number) => fvar.getInt32(at) / 65536;
  return Array.from({ length: count }, (_, i) => {
    const at = offset + i * size;
    const tag = String.fromCharCode(fvar.getUint8(at), fvar.getUint8(at + 1), fvar.getUint8(at + 2), fvar.getUint8(at + 3));
    return { tag, min: fixed(at + 4), default: fixed(at + 8), max: fixed(at + 12) };
  });
}

export function readWoff2(file: Uint8Array): FontInfo {
  const t = tables(file);
  const cmap = t.get("cmap");
  if (!cmap) throw new Error("woff2: no cmap table");
  return { hasGlyph: cmapLookup(cmap), axes: fvarAxes(t.get("fvar")) };
}
