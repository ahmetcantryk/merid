// Doküman kod sekmelerinde gösterilen kaynak metinler. Server component'ler okuyabilsin diye client modülünün dışında tutulur.

export const stepperBasicCode = `import { Stepper } from "@merid/react";

const STATUS_LABELS = { complete: "Tamamlandı", current: "Geçerli adım", upcoming: "Başlanmadı" };

export function Example() {
  return (
    <Stepper.Root current={1} aria-label="Ödeme adımları">
      <Stepper.Step title="Hesap" statusLabels={STATUS_LABELS} />
      <Stepper.Step title="Teslimat" statusLabels={STATUS_LABELS} />
      <Stepper.Step title="Ödeme" statusLabels={STATUS_LABELS} />
      <Stepper.Step title="Özet" statusLabels={STATUS_LABELS} />
    </Stepper.Root>
  );
}`;


export const stepperVerticalCode = `<Stepper.Root current={2} orientation="vertical" aria-label="Hesap kurulumu">
  <Stepper.Step title="Çalışma alanı oluştur" description="Ad ve bölge" statusLabels={STATUS_LABELS} />
  <Stepper.Step title="Ekibi davet et" description="En fazla 10 kişi ekle" statusLabels={STATUS_LABELS} />
  <Stepper.Step title="Veriyi bağla" description="CSV'den ya da bir API'den import et" statusLabels={STATUS_LABELS} />
  <Stepper.Step title="Yayına al" statusLabels={STATUS_LABELS} />
</Stepper.Root>`;
