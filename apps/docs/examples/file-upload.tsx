"use client";

import { useState } from "react";
import { Field, FileUpload, type FileRejection } from "@meridui/react";

const stack = { display: "grid", gap: 8, width: "min(100%, 420px)" } as const;
const note = { fontSize: 13, color: "var(--mrd-muted)" } as const;

const REASONS: Record<string, string> = {
  "file-invalid-type": "type not allowed",
  "file-too-large": "larger than 2 MB",
  "file-too-small": "empty file",
  "too-many-files": "too many files",
};

export function FileUploadBasic() {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const onReject = (rejections: FileRejection[]) =>
    setErrors(rejections.map((r) => `${r.file.name}: ${r.reasons.map((x) => REASONS[x]).join(", ")}`));
  return (
    <div style={stack}>
      <Field label="Attachments" error={errors.length > 0 ? errors.join("; ") : undefined}>
        <FileUpload
          multiple
          maxFiles={3}
          maxSize={2_000_000}
          accept="image/*,.pdf"
          description="PNG, JPG or PDF, up to 2 MB each. Three files at most."
          value={files}
          onValueChange={(next) => {
            setFiles(next);
            setErrors([]);
          }}
          onReject={onReject}
          name="attachments"
        />
      </Field>
    </div>
  );
}

export function FileUploadSingle() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div style={stack}>
      <Field label="Avatar">
        <FileUpload
          accept="image/*"
          label="Drop an image"
          buttonLabel="Choose image"
          onValueChange={(files) => setFile(files[0] ?? null)}
        />
      </Field>
      <span style={note}>{file ? `${file.name} (${file.type || "unknown type"})` : "No file"}</span>
    </div>
  );
}

export function FileUploadDisabled() {
  return (
    <div style={stack}>
      <FileUpload disabled description="Uploads are paused." />
    </div>
  );
}
