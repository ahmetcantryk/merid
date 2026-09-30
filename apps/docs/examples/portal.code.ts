// Source strings shown in the docs code tabs. Kept out of the client module so server components can read them.

export const portalBasicCode = `import { useState } from "react";
import { Button, Portal } from "@meridui/react";

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen((o) => !o)}>{open ? "Remove" : "Render"} banner</Button>
      {open ? (
        <Portal>
          <div role="status" className="floating-banner">
            Rendered into document.body
          </div>
        </Portal>
      ) : null}
    </>
  );
}`;


export const portalContainerCode = `const [target, setTarget] = useState<HTMLDivElement | null>(null);

return (
  <>
    <div ref={setTarget} />
    <Portal container={target}>Placed inside the target box</Portal>
  </>
);`;
