export const toastBasicCode = `import { Button, ToastProvider, useToast } from "@merid/react";

function SaveButton() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({ title: "Changes saved", description: "Your workspace settings are up to date.", tone: "success" })
      }
    >
      Save changes
    </Button>
  );
}

export function App() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}`;

export const toastTonesCode = `toast({ title: "A neutral toast", tone: "neutral" });
toast({ title: "A info toast", tone: "info" });
toast({ title: "A success toast", tone: "success" });
toast({ title: "A warning toast", tone: "warning" });
toast({ title: "A danger toast", tone: "danger" });`;

export const toastActionCode = `const { toast, dismiss } = useToast();

toast({
  id: "archive", // reusing an id replaces the existing toast
  title: "Project archived",
  duration: Infinity, // stays until dismissed
  action: { label: "Undo", onClick: () => toast({ title: "Project restored", tone: "success" }) },
});

dismiss(); // removes every toast`;
