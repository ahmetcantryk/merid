export const toastBasicCode = `import { Button, ToastProvider, useToast } from "@merid/react";

function SaveButton() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({ title: "Değişiklikler kaydedildi", description: "Çalışma alanı ayarların güncel.", tone: "success" })
      }
    >
      Değişiklikleri kaydet
    </Button>
  );
}

export function App() {
  return (
    <ToastProvider label="Bildirimler">
      <SaveButton />
    </ToastProvider>
  );
}`;

export const toastTonesCode = `toast({ title: "neutral tonunda bir toast", tone: "neutral" });
toast({ title: "info tonunda bir toast", tone: "info" });
toast({ title: "success tonunda bir toast", tone: "success" });
toast({ title: "warning tonunda bir toast", tone: "warning" });
toast({ title: "danger tonunda bir toast", tone: "danger" });`;

export const toastActionCode = `const { toast, dismiss } = useToast();

toast({
  id: "archive", // aynı id'yi kullanmak mevcut toast'u değiştirir
  title: "Proje arşivlendi",
  duration: Infinity, // kapatılana kadar kalır
  action: { label: "Geri al", onClick: () => toast({ title: "Proje geri yüklendi", tone: "success" }) },
});

dismiss(); // tüm toast'ları kaldırır`;
