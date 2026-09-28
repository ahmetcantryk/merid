"use client";

import { createContext, useContext } from "react";
import { joinIds } from "../../utils/cx";

export interface FieldContextValue {
  /** id applied to the control. */
  controlId: string;
  /** id of the visible label. */
  labelId: string;
  /** id of the description, when rendered. */
  descriptionId?: string;
  /** id of the error message, when rendered. */
  errorId?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

/** Reads the surrounding `Field`, if any. */
export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

interface ControlOwnProps {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
  required?: boolean;
  disabled?: boolean;
}

/**
 * Merges Field wiring (id, aria-describedby, aria-invalid, required, disabled)
 * into a control's own props. Explicit props always win.
 *
 * Convention for every form control: `aria-invalid` carries the semantics and
 * `data-invalid` (set from the returned `invalid`) drives the styling.
 */
export function useFieldControlProps(own: ControlOwnProps & { invalid?: boolean }) {
  const field = useFieldContext();
  const ownAria = own["aria-invalid"];
  const invalid =
    own.invalid ?? (ownAria === undefined ? undefined : ownAria !== false && ownAria !== "false") ?? field?.invalid ?? false;
  return {
    id: own.id ?? field?.controlId,
    "aria-describedby": joinIds(own["aria-describedby"], field?.descriptionId, invalid ? field?.errorId : undefined),
    "aria-invalid": own["aria-invalid"] ?? (invalid ? (true as const) : undefined),
    required: own.required ?? (field?.required || undefined),
    disabled: own.disabled ?? (field?.disabled || undefined),
    invalid,
  };
}
