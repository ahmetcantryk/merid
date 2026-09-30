/** Validation and formatting helpers for FileUpload. */

export type FileRejectionReason = "file-invalid-type" | "file-too-large" | "file-too-small" | "too-many-files";

export interface FileRejection {
  file: File;
  reasons: FileRejectionReason[];
}

/** True when `file` matches an `accept` string (`.png`, `image/*`, `application/pdf`, comma-separated). */
export function matchesAccept(file: File, accept: string | undefined): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();
  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith(".")) return name.endsWith(token);
      if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
      return type === token;
    });
}

export interface ValidateOptions {
  accept?: string;
  minSize?: number;
  maxSize?: number;
  maxFiles?: number;
  multiple: boolean;
}

/** Splits `incoming` into accepted files and rejections, given how many files are already kept. */
export function validateFiles(
  incoming: readonly File[],
  existingCount: number,
  { accept, minSize, maxSize, maxFiles, multiple }: ValidateOptions,
): { accepted: File[]; rejected: FileRejection[] } {
  const limit = multiple ? (maxFiles ?? Number.POSITIVE_INFINITY) : 1;
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  for (const file of incoming) {
    const reasons: FileRejectionReason[] = [];
    if (!matchesAccept(file, accept)) reasons.push("file-invalid-type");
    if (maxSize !== undefined && file.size > maxSize) reasons.push("file-too-large");
    if (minSize !== undefined && file.size < minSize) reasons.push("file-too-small");
    // A single-file upload replaces its file, so only multiple uploads count what is already there.
    const room = multiple ? limit - existingCount - accepted.length : limit - accepted.length;
    if (reasons.length === 0 && room <= 0) reasons.push("too-many-files");
    if (reasons.length > 0) rejected.push({ file, reasons });
    else accepted.push(file);
  }
  return { accepted, rejected };
}

/** Human-readable size in `locale`, e.g. `1.2 MB` / `1,2 MB`. */
export function formatBytes(bytes: number, locale?: string): string {
  const units = ["byte", "kilobyte", "megabyte", "gigabyte"] as const;
  let value = bytes;
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit += 1;
  }
  try {
    return new Intl.NumberFormat(locale, {
      style: "unit",
      unit: units[unit],
      unitDisplay: "short",
      maximumFractionDigits: unit === 0 ? 0 : 1,
    }).format(value);
  } catch {
    return `${Math.round(value * 10) / 10} ${["B", "KB", "MB", "GB"][unit]}`;
  }
}
