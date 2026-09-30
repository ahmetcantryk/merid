"use client";

import { useState } from "react";
import { Field, FileUpload, type FileRejection } from "@meridui/react";

const stack = { display: "grid", gap: 8, width: "min(100%, 420px)" } as const;
const note = { fontSize: 13, color: "var(--mrd-muted)" } as const;

/** Türkçe arayüz ve ekran okuyucu metinleri. */
const tr = {
  label: "Dosyaları buraya sürükle",
  buttonLabel: "Dosya seç",
  getRemoveLabel: (file: File) => `${file.name} dosyasını kaldır`,
  getStatusText: (count: number) => `${count} dosya seçildi`,
  locale: "tr-TR",
} as const;

const REASONS: Record<string, string> = {
  "file-invalid-type": "bu türe izin verilmiyor",
  "file-too-large": "2 MB'tan büyük",
  "file-too-small": "dosya boş",
  "too-many-files": "çok fazla dosya",
};

export function FileUploadBasic() {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const onReject = (rejections: FileRejection[]) =>
    setErrors(rejections.map((r) => `${r.file.name}: ${r.reasons.map((x) => REASONS[x]).join(", ")}`));
  return (
    <div style={stack}>
      <Field label="Ekler" error={errors.length > 0 ? errors.join("; ") : undefined}>
        <FileUpload
          {...tr}
          multiple
          maxFiles={3}
          maxSize={2_000_000}
          accept="image/*,.pdf"
          description="PNG, JPG ya da PDF; her biri en fazla 2 MB. En fazla üç dosya."
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
      <Field label="Profil fotoğrafı">
        <FileUpload
          {...tr}
          accept="image/*"
          label="Bir görsel sürükle"
          buttonLabel="Görsel seç"
          onValueChange={(files) => setFile(files[0] ?? null)}
        />
      </Field>
      <span style={note}>{file ? `${file.name} (${file.type || "bilinmeyen tür"})` : "Dosya yok"}</span>
    </div>
  );
}

export function FileUploadDisabled() {
  return (
    <div style={stack}>
      <FileUpload {...tr} disabled description="Yüklemeler duraklatıldı." />
    </div>
  );
}
