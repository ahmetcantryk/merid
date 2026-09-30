/**
 * Turkish text for the token tables and specimens rendered by `components/foundations.tsx`.
 * Token names and values stay in `lib/tokens.ts`; this file only maps them to Turkish descriptions.
 * A missing key falls back to the English text.
 */

export const colorGroupTitlesTr: Readonly<Record<string, string>> = {
  Accent: "Accent",
  Surfaces: "Yüzeyler",
  Lines: "Çizgiler",
  Text: "Metin",
  Status: "Durum",
};

export const colorRolesTr: Readonly<Record<string, string>> = {
  "--mrd-accent": "Etkileşimli elemanlar, seçim, focus",
  "--mrd-accent-hover": "Accent ve linklerin hover state'i",
  "--mrd-accent-soft": "Seçili satır, ikon kutusu, bilgi tonu",
  "--mrd-accent-strong": "accent-soft üzerindeki metin",
  "--mrd-on-accent": "Accent dolgu üzerindeki metin",
  "--mrd-bg": "Sayfa arka planı",
  "--mrd-surface": "Gri yüzey üzerindeki kartlar, dialog'lar, input'lar, menüler",
  "--mrd-tray": "İçe gömük bölümler, sayfadaki kartlar, hover",
  "--mrd-tray-2": "Gri yüzey üzerindeki ray, shimmer",
  "--mrd-subtle": "Tablo başlığı, pencere çubuğu, detay paneli",
  "--mrd-line": "Tüm ince çizgiler",
  "--mrd-line-strong": "Kesikli dropzone, kapalı switch kenarlığı",
  "--mrd-ink": "Başlıklar, vurgulu metin",
  "--mrd-body": "Gövde metni",
  "--mrd-muted": "Meta, ikonlar",
  "--mrd-placeholder": "Input placeholder'ı",
  "--mrd-danger": "Geçersiz kenarlık, durum noktası",
  "--mrd-danger-solid": "Tehlikeli buton dolgusu (beyaz metin, AA)",
  "--mrd-danger-solid-hover": "Tehlikeli buton hover'ı",
  "--mrd-danger-soft": "Hata bildirimi arka planı",
  "--mrd-danger-strong": "Hata bildirimi metni",
  "--mrd-warning-soft": "Uyarı bildirimi arka planı",
  "--mrd-warning-strong": "Uyarı bildirimi metni",
  "--mrd-success": "Yalnızca başarı ikonu veya noktası",
  "--mrd-success-soft": "Başarı bildirimi arka planı",
  "--mrd-success-strong": "Başarı bildirimi metni",
  "--mrd-control-off": "Kapalı switch rayı",
  "--mrd-tooltip-bg": "Tooltip arka planı",
  "--mrd-tooltip-fg": "Tooltip metni",
};

/** `use` descriptions for type, radius, shadow and motion tokens, keyed by token name. */
export const tokenUsesTr: Readonly<Record<string, string>> = {
  "--mrd-text-display": "Hero başlığı",
  "--mrd-text-h2": "Bölüm başlığı",
  "--mrd-text-h3": "Kart başlığı",
  "--mrd-text-lg": "Giriş paragrafı",
  "--mrd-text-md": "Gövde metni",
  "--mrd-text-sm": "Buton, input, navigasyon, liste",
  "--mrd-text-xs": "Küçük buton, etiket, pill",
  "--mrd-text-2xs": "Meta, yardım metni, notlar",
  "--mrd-text-3xs": "Badge, açıklama yazısı",
  "--mrd-radius-xs": "Focus halkası, skeleton, satır içi kod",
  "--mrd-radius-sm": "Tooltip, küçük kutular",
  "--mrd-radius-md": "İkon butonu, menü öğesi, navigasyon linki",
  "--mrd-radius-lg": "Buton, input, alert, satır",
  "--mrd-radius-xl": "Pencere çerçevesi, popover",
  "--mrd-radius-2xl": "Menü, mobil kart",
  "--mrd-radius-card": "Kart, panel, dialog",
  "--mrd-radius-3xl": "Harekete çağrı bloğu",
  "--mrd-radius-full": "Pill, badge, switch, avatar",
  "--mrd-shadow-xs": "Seçili pill",
  "--mrd-shadow-sm": "İkon kutusu",
  "--mrd-shadow-md": "Kart yükselmesi",
  "--mrd-shadow-lg": "Popover, toast, tooltip",
  "--mrd-shadow-xl": "Menü",
  "--mrd-shadow-2xl": "Dialog",
  "--mrd-shadow-accent": "Yalnızca birincil buton",
  "--mrd-duration-fast": "Basma geri bildirimi",
  "--mrd-duration": "Renk, kenarlık ve gölge değişimleri",
  "--mrd-duration-slow": "Yükselme, dönme, overlay",
  "--mrd-ease": "Tüm geçişler",
};

export const foundationsUiTr = {
  token: "Token",
  light: "Açık",
  dark: "Koyu",
  role: "Rol",
  value: "Değer",
  use: "Kullanım",
  groupTokens: (title: string) => `${title} token'ları`,
  motionTokens: "Hareket token'ları",
  specimen: "Varsayılan olarak net",
  lift: "Hover'da 3px yüksel",
  press: "Basınca .97'ye küçül",
  tint: "Hover'da renklen",
} as const;
