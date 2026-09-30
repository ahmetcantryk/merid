// Source strings shown in the docs code tabs. Kept out of the client module so server components can read them.

export const portalBasicCode = `import { useState } from "react";
import { Button, Portal } from "@meridui/react";

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen((o) => !o)}>Banner'ı {open ? "kaldır" : "göster"}</Button>
      {open ? (
        <Portal>
          <div role="status" className="floating-banner">
            document.body içine render'landı
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
    <Portal container={target}>Hedef kutunun içine yerleşti</Portal>
  </>
);`;
