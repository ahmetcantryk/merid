// Just enough CSS reading to find, compare and remove top-level rules. No dependencies, no I/O.

export interface CssStatement {
  /** Offset of the statement's first character. */
  readonly start: number;
  /** Offset just past its closing `}` or `;`. */
  readonly end: number;
  readonly text: string;
}

function skipString(source: string, at: number): number {
  const quote = source[at];
  let i = at + 1;
  while (i < source.length && source[i] !== quote) i += source[i] === "\\" ? 2 : 1;
  return i + 1;
}

/** Splits a stylesheet into its top-level rules and at-rules. Comments between them are skipped. */
export function topLevelStatements(source: string): CssStatement[] {
  const statements: CssStatement[] = [];
  let depth = 0;
  let start = -1;
  let i = 0;
  const close = (end: number) => {
    statements.push({ start, end, text: source.slice(start, end) });
    start = -1;
  };
  while (i < source.length) {
    const ch = source[i] ?? "";
    if (ch === "/" && source[i + 1] === "*") {
      const endOfComment = source.indexOf("*/", i + 2);
      i = endOfComment === -1 ? source.length : endOfComment + 2;
      continue;
    }
    if (start === -1) {
      if (/\s/.test(ch)) {
        i += 1;
        continue;
      }
      start = i;
    }
    if (ch === '"' || ch === "'") {
      i = skipString(source, i);
      continue;
    }
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth = Math.max(0, depth - 1);
      if (depth === 0) close(i + 1);
    } else if (ch === ";" && depth === 0) close(i + 1);
    i += 1;
  }
  if (start !== -1 && source.slice(start).trim() !== "") close(source.length);
  return statements;
}

/** A form of a rule that ignores formatting: comments, whitespace, quote style and the optional last semicolon. */
export function normalizeCss(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/'/g, '"')
    .replace(/\s+/g, " ")
    .replace(/\s*([{};:,>+~()])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

export interface CssEdit {
  readonly statement: CssStatement;
  /** Text to put in its place; the statement is deleted when omitted. */
  readonly replacement?: string;
}

/**
 * Applies edits to whole statements. A deleted statement takes its line with it, runs of blank lines are
 * collapsed to one, and the file keeps its line endings.
 */
export function editStatements(source: string, edits: readonly CssEdit[]): string {
  if (edits.length === 0) return source;
  const eol = source.includes("\r\n") ? "\r\n" : "\n";
  const sorted = [...edits].sort((a, b) => b.statement.start - a.statement.start);
  let out = source;
  for (const { statement, replacement } of sorted) {
    if (replacement !== undefined) {
      out = out.slice(0, statement.start) + replacement.replace(/\r?\n/g, eol) + out.slice(statement.end);
      continue;
    }
    let from = statement.start;
    while (from > 0 && (out[from - 1] === " " || out[from - 1] === "\t")) from -= 1;
    let to = statement.end;
    while (to < out.length && (out[to] === " " || out[to] === "\t")) to += 1;
    if (out.startsWith(eol, to)) to += eol.length;
    out = out.slice(0, from) + out.slice(to);
  }
  const blank = new RegExp(`(?:${eol}[ \\t]*){3,}`, "g");
  return out
    .replace(blank, `${eol}${eol}`)
    .replace(new RegExp(`^(?:[ \\t]*${eol})+`), "")
    .replace(new RegExp(`(?:${eol}[ \\t]*)+$`), out.trim() === "" ? "" : eol);
}
