// Minimal unified line diff (LCS) for showing planned file changes. No dependencies.

type Op = { readonly kind: " " | "-" | "+"; readonly line: string };

const MAX_CELLS = 4_000_000;

function ops(a: readonly string[], b: readonly string[]): Op[] {
  if (a.length * b.length > MAX_CELLS) {
    return [...a.map((line) => ({ kind: "-" as const, line })), ...b.map((line) => ({ kind: "+" as const, line }))];
  }
  const rows = a.length + 1;
  const cols = b.length + 1;
  const table = new Uint32Array(rows * cols);
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i * cols + j] = a[i] === b[j] ? (table[(i + 1) * cols + j + 1] ?? 0) + 1 : Math.max(table[(i + 1) * cols + j] ?? 0, table[i * cols + j + 1] ?? 0);
    }
  }
  const out: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      out.push({ kind: " ", line: a[i] ?? "" });
      i += 1;
      j += 1;
    } else if ((table[(i + 1) * cols + j] ?? 0) >= (table[i * cols + j + 1] ?? 0)) {
      out.push({ kind: "-", line: a[i] ?? "" });
      i += 1;
    } else {
      out.push({ kind: "+", line: b[j] ?? "" });
      j += 1;
    }
  }
  while (i < a.length) out.push({ kind: "-", line: a[i++] ?? "" });
  while (j < b.length) out.push({ kind: "+", line: b[j++] ?? "" });
  return out;
}

/** Unified diff with `context` lines around each change. Empty string when the texts are equal. */
export function unifiedDiff(before: string, after: string, file: string, context = 3): string {
  if (before === after) return "";
  const a = before === "" ? [] : before.replace(/\r\n/g, "\n").split("\n");
  const b = after.replace(/\r\n/g, "\n").split("\n");
  const all = ops(a, b);
  const changed = all.map((op, index) => (op.kind === " " ? -1 : index)).filter((index) => index !== -1);
  if (changed.length === 0) return "";
  const keep = new Set<number>();
  for (const index of changed) for (let k = index - context; k <= index + context; k += 1) if (k >= 0 && k < all.length) keep.add(k);
  const lines = [`--- ${before === "" ? "/dev/null" : `a/${file}`}`, `+++ b/${file}`];
  let previous = -2;
  for (let index = 0; index < all.length; index += 1) {
    if (!keep.has(index)) continue;
    if (index !== previous + 1) lines.push("@@");
    const op = all[index];
    if (op) lines.push(`${op.kind}${op.line}`);
    previous = index;
  }
  return lines.join("\n");
}
