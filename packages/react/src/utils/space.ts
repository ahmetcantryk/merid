/** Keys of the `--mrd-space-*` scale. */
export type SpaceToken = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 14 | 16 | 18 | 28;

/** Resolves a space token to a CSS value referencing the token variable. */
export function spaceVar(token: SpaceToken | undefined): string | undefined {
  if (token === undefined) return undefined;
  return token === 0 ? "0px" : `var(--mrd-space-${token})`;
}
