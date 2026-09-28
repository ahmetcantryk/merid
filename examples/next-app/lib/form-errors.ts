import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ActionResult } from "./schemas";

/** Maps a failed server action onto react-hook-form: field errors per field, anything else on `root`. */
export function applyServerErrors<T extends FieldValues>(result: ActionResult, setError: UseFormSetError<T>) {
  if (result.ok) return;
  for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
    setError(field as Path<T>, { type: "server", message }, { shouldFocus: true });
  }
  if (result.formError) setError("root", { type: "server", message: result.formError });
}
