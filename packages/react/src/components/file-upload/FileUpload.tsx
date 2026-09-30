"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useId } from "../../internal/ovl-use-id";
import { cx, joinIds } from "../../utils/cx";
import { useControllableState } from "../../utils/use-controllable";
import { useFieldContext, useFieldControlProps } from "../field/field-context";
import { type FileRejection, formatBytes, validateFiles } from "./file-utils";

export type { FileRejection, FileRejectionReason } from "./file-utils";

export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "onDrop"> {
  /** Selected files (controlled). */
  value?: File[];
  /** Initially selected files (uncontrolled). */
  defaultValue?: File[];
  /** Called with the full list of kept files after every add or remove. */
  onValueChange?: (files: File[]) => void;
  /** Called with the files that failed `accept`, size or count checks. */
  onReject?: (rejections: FileRejection[]) => void;
  /** Accepted types, as on `<input type="file">`: `"image/*,.pdf"`. */
  accept?: string;
  /** Allow more than one file. Defaults to `false` (a new file replaces the old one). */
  multiple?: boolean;
  /** Largest file in bytes. */
  maxSize?: number;
  /** Smallest file in bytes. */
  minSize?: number;
  /** Most files kept when `multiple`. */
  maxFiles?: number;
  /** Disables the dropzone and button. */
  disabled?: boolean;
  /** Invalid style and `aria-invalid`. Inside a `Field`, derived from its `error`. */
  invalid?: boolean;
  /** Marks the file input required. */
  required?: boolean;
  /** Form field name of the file input. */
  name?: string;
  /** Main line in the dropzone. Defaults to `"Drag and drop files here"`. */
  label?: ReactNode;
  /** Text of the browse button. Defaults to `"Browse files"`. */
  buttonLabel?: ReactNode;
  /** Hint under the label, e.g. accepted types and size. Linked to the button with `aria-describedby`. */
  description?: ReactNode;
  /** Render the list of selected files with remove buttons. Defaults to `true`. */
  showFileList?: boolean;
  /** Accessible name of a file's remove button. Defaults to `(file) => \`Remove ${file.name}\``. */
  getRemoveLabel?: (file: File) => string;
  /** Text announced to screen readers when the selection changes. Defaults to `"N file(s) selected"`. */
  getStatusText?: (count: number) => string;
  /** Locale for file sizes. Defaults to the runtime locale. */
  locale?: string;
  /** Icon above the label. */
  icon?: ReactNode;
}

const defaultRemoveLabel = (file: File): string => `Remove ${file.name}`;
const defaultStatusText = (count: number): string => (count === 1 ? "1 file selected" : `${count} files selected`);

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path d="M10 13V3.5M6 7.5l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 12.5v2a2 2 0 002 2h9a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * File picker with a drag-and-drop zone. The browse button is the keyboard and screen reader path;
 * dropping is a pointer shortcut. Selected files are listed with remove buttons and the count is announced.
 */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(
  {
    value,
    defaultValue = [],
    onValueChange,
    onReject,
    accept,
    multiple = false,
    maxSize,
    minSize,
    maxFiles,
    disabled,
    invalid,
    required,
    name,
    label = "Drag and drop files here",
    buttonLabel = "Browse files",
    description,
    showFileList = true,
    getRemoveLabel = defaultRemoveLabel,
    getStatusText = defaultStatusText,
    locale,
    icon,
    className,
    id,
    ...props
  },
  ref,
) {
  const [files, setFiles] = useControllableState<File[]>(value, defaultValue, onValueChange);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dragDepth = useRef(0);
  const baseId = useId(id, "mrd-file-upload");
  const descriptionId = description ? `${baseId}-description` : undefined;
  const { invalid: isInvalid, ...wiring } = useFieldControlProps({
    id: undefined,
    disabled,
    required,
    invalid,
    "aria-describedby": props["aria-describedby"],
    "aria-invalid": props["aria-invalid"],
  });
  const isDisabled = Boolean(wiring.disabled);
  const field = useFieldContext();

  // Mirror the kept files onto the real input so a native form submit carries them.
  const mirror = (list: readonly File[]) => {
    const input = inputRef.current;
    if (!input || typeof DataTransfer === "undefined") return;
    try {
      const transfer = new DataTransfer();
      for (const file of list) transfer.items.add(file);
      input.files = transfer.files;
    } catch {
      // Some engines do not allow assigning FileList; the files are still reported through onValueChange.
    }
  };
  useEffect(() => mirror(files), [files]);

  const add = (incoming: File[]) => {
    if (isDisabled || incoming.length === 0) return;
    const { accepted, rejected } = validateFiles(incoming, files.length, { accept, minSize, maxSize, maxFiles, multiple });
    if (rejected.length > 0) onReject?.(rejected);
    if (accepted.length === 0) return;
    const next = multiple ? [...files, ...accepted] : accepted.slice(0, 1);
    setFiles(next);
    setStatus(getStatusText(next.length));
  };

  const remove = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    setStatus(getStatusText(next.length));
    buttonRef.current?.focus();
  };

  const onDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    event.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  };
  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
  };
  const onDragLeave = () => {
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  };
  const onDropFiles = (event: DragEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    add(Array.from(event.dataTransfer?.files ?? []));
  };

  return (
    <div
      ref={ref}
      id={id}
      className={cx("mrd-file-upload", className)}
      data-dragging={dragging || undefined}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      {...props}
      aria-describedby={undefined}
      aria-invalid={undefined}
    >
      <div
        className="mrd-file-upload__dropzone"
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDropFiles}
      >
        <span className="mrd-file-upload__icon">{icon ?? <UploadIcon />}</span>
        <p className="mrd-file-upload__label">{label}</p>
        {description ? (
          <p id={descriptionId} className="mrd-file-upload__description">
            {description}
          </p>
        ) : null}
        <button
          ref={buttonRef}
          type="button"
          id={wiring.id}
          className="mrd-file-upload__button"
          disabled={isDisabled}
          aria-labelledby={field ? joinIds(`${baseId}-button-text`, field.labelId) : undefined}
          aria-describedby={joinIds(descriptionId, wiring["aria-describedby"])}
          aria-invalid={wiring["aria-invalid"]}
          onClick={() => inputRef.current?.click()}
        >
          <span id={`${baseId}-button-text`}>{buttonLabel}</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          hidden
          tabIndex={-1}
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={isDisabled}
          required={wiring.required && files.length === 0}
          onChange={(event) => {
            const picked = Array.from(event.currentTarget.files ?? []);
            // Reset so choosing the same file again still fires change; kept files are re-mirrored by the effect.
            event.currentTarget.value = "";
            mirror(files);
            add(picked);
          }}
        />
      </div>
      {showFileList && files.length > 0 ? (
        <ul className="mrd-file-upload__list">
          {files.map((file, index) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}-${index}`} className="mrd-file-upload__item">
              <span className="mrd-file-upload__name">{file.name}</span>
              <span className="mrd-file-upload__size">{formatBytes(file.size, locale)}</span>
              <button
                type="button"
                className="mrd-file-upload__remove"
                aria-label={getRemoveLabel(file)}
                disabled={isDisabled}
                onClick={() => remove(index)}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mrd-visually-hidden" role="status">
        {status}
      </div>
    </div>
  );
});
