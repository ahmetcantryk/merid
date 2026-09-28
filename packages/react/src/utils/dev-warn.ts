const warned = new Set<string>();

function isProduction(): boolean {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env?.NODE_ENV === "production";
}

/** Logs a one-time console warning outside production builds. */
export function devWarn(key: string, message: string): void {
  if (isProduction() || warned.has(key)) return;
  warned.add(key);
  console.warn(`[merid] ${message}`);
}
