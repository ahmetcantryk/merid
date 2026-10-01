# Merid Türkçe terim sözlüğü

Merid dokümanlarının Türkçe çevirisi bu sözlüğe uyar. Amaç birebir çeviri değil; Türkiye'deki frontend ekiplerinin Slack'te, PR yorumlarında ve teknik yazılarda gerçekten kullandığı dil.

Yeni bir sayfa çevirirken veya mevcut bir çeviriyi düzeltirken önce buraya bak. Burada olmayan bir terimle karşılaşırsan tabloya ekle ve gerekçesini yaz.

## Genel ilkeler

1. **Sektörün İngilizce kullandığı terimi çevirme.** "Bileşen", "özellik" (prop), "kanca" (hook) gibi karşılıklar ders kitabı dili; ekipler bunları kullanmaz. Okuyan kişi terimi koddan ve issue'lardan tanır.
2. **Doğal ve yaygın bir Türkçe karşılık varsa onu kullan.** "Kurulum", "erişilebilirlik", "klavye", "tema" herkesin kullandığı kelimeler.
3. **Türkçe ek gelen İngilizce terimi kesme işaretiyle ayır**, ek okunuşa göre seçilir: component'ler, token'ları, prop'u, hook'u, state'i, render'lar, layer'da, focus'u, badge'i, tab'lar, toast'u, commit'ler, release'te.
4. **Fiil gerekiyorsa "-lamak / -lemek" ekini kesmeyle bağla**: render'lamak, import etmek, deploy etmek. "Render etmek" de doğru; sayfada tek biçim seç: bu çeviride **"render'lar / render'lanır"** kullanılır.
5. **"Sen" dili.** "Kurabilirsiniz" değil "kurabilirsin"; "tıklayınız" değil "tıkla". Emir kipi yalın: "Stil dosyasını import et."
6. **Ton sade ve net.** "Harika!", ünlem, emoji, abartı yok. Kısa cümle. Pasif yerine mümkünse aktif: "Merid focus'u yönetir", "focus Merid tarafından yönetilir" değil.
7. **Başlıklar cümle düzeninde.** "Hızlı başlangıç", "Klavye etkileşimi". Her kelimenin ilk harfi büyük yazılmaz.
8. **Kod İngilizce kalır.** Değişken, fonksiyon, prop, dosya adı, CSS sınıfı, token adı çevrilmez. Kod içindeki yorumlar ve örnek arayüz metinleri (buton etiketi, placeholder, toast mesajı) Türkçeleşir.
9. **Component adları özel isimdir.** `Button`, `Dialog`, `AlertDialog`, `DropdownMenu` olduğu gibi kalır; sayfa başlığı da component'in adıdır. Genel kavramdan bahsederken küçük harf ve İngilizce terim kullanılır: "dialog açıldığında", "bir tooltip".
10. **Linkler `/tr/docs/...`** ile başlar. Anchor'lar Türkçe başlıktan üretilir.
11. **Pazarlama metni ayrı.** Landing, meta açıklamaları, OG görselleri ve sosyal medyada "component" yerine "bileşen", "accent" yerine "vurgu rengi" kullanılır; okur orada daha geniş. Kod, menü etiketleri ve doküman sayfaları bu sözlüğe uyar.
12. **"Plain CSS" her yerde "düz CSS".** Türk geliştirici "sade CSS" demiyor.

## Çevrilmeyen terimler

| Terim | Örnek kullanım | Gerekçe |
|---|---|---|
| component | "46 component", "component'in ref'i" | "Bileşen" akademik kalıyor; ekipler "component" diyor. |
| props / prop | "`variant` prop'u", "Props tablosu" | React API terimi, kodda aynen geçiyor. |
| token / design token | "renk token'ları", "design token'lar" | Figma, Style Dictionary ve CSS değişken adlarıyla birebir aynı kavram. |
| design system | "bir design system kurarken" | Sektörde yerleşik; "tasarım sistemi" de anlaşılır ama rehberlerde ve iş ilanlarında İngilizcesi baskın. |
| hook | "`useToast` hook'u" | React terimi. |
| state | "loading state'i", "controlled state" | React ve UI terimi; "durum" yalnızca genel anlamda (boş durum, hata durumu) kullanılır. |
| render | "`<button>` render'lar" | React terimi. |
| server component / client component | "server component'lerde çalışır" | React ve Next.js terimi. |
| bundle | "bundle boyutu" | Build aracı terimi. |
| theme | Kod ve attribute bağlamında: "`data-theme`" | Genel anlamda "tema" kullanılır, aşağıya bak. |
| dark mode | "dark mode'da gölge yerine halka" | Ürünlerde ve ayar ekranlarında yerleşik. "Koyu tema" yalnızca kullanıcıya dönük arayüz metninde (buton etiketi, tema seçici) geçer. |
| accent | "accent rengi", "tek accent" | Merid'in token adı (`--mrd-accent`) ve tasarım ekiplerinin dili. |
| focus | "focus halkası", "focus'u tetikleyiciye döndürür" | Tarayıcı ve erişilebilirlik terimi; "odak" çevirisi dokümanlarda tuhaf duruyor. Fiil olarak "focus'lanır" yerine "focus alır" tercih edilir. |
| hover | "hover'da renk değişir" | Yerleşik. |
| tooltip, dropdown, modal, dialog, toast, badge, tab, checkbox, switch, popover, drawer, accordion | "bir dialog açar", "toast'lar" | UI kalıplarının ortak adları; tasarımcı ve geliştirici aynı kelimeyi kullanıyor. |
| slot | "ikon slot'u" | Component API terimi. |
| layout, grid, stack | "layout primitive'leri", "iki kolonlu grid" | CSS ve component terimi. |
| breakpoint, viewport | "`md` breakpoint'inde" | CSS terimi. |
| cascade layer, layer | "üç cascade layer", "`merid.components` layer'ı" | CSS `@layer` terimi. |
| fallback | "fallback değeri" | Yerleşik. |
| playground | "Playground" | Ürün içi özellik adı. |
| open source, pull request, issue, commit, release, changelog | "bir issue aç", "pull request gönder" | GitHub akışının dili. "Changelog" sayfa adı olarak "Sürüm notları"na çevrilir, metin içinde "changelog" kalabilir. |
| npm, CLI, SSR, RSC, CSS-in-JS | | Kısaltmalar ve araç adları. |
| ref, children, className, asChild | "ref'i `<button>`'a iletir" | React API adları. |
| trigger | Kod bağlamında: "`Dialog.Trigger`" | Metinde "tetikleyici" kullanılır. |
| deploy, build, production | "production'a deploy et" | Ekip jargonunda yerleşik. |
| gutter, container | "container genişliği" | Layout terimi, token adlarında geçiyor. |
| primitive | "layout primitive'leri" | Component kütüphanelerinde yerleşik. |
| overlay | "overlay component'leri" | Kategori adı olarak yerleşik. |
| agent, AI agent | "agent'ın yazdığı kod" | Claude Code, Cursor gibi araçların kendi dili; "ajan" dokümanlarda tuhaf duruyor. Başlıkta "AI ile kullanım". |
| MCP server, MCP client, config | "MCP server'ı ekle", "MCP config'i" | Protokol terimi; araçların arayüzünde İngilizce geçiyor. |

## Çevrilen terimler

| İngilizce | Türkçe | Gerekçe |
|---|---|---|
| Getting started | Başlarken | Yerleşik bölüm adı. |
| Installation | Kurulum | Herkesin kullandığı karşılık. |
| Usage | Kullanım | |
| Introduction | Giriş | |
| Accessibility | Erişilebilirlik | Mevzuatta ve sektörde yerleşik. |
| Keyboard interaction | Klavye etkileşimi | |
| Examples | Örnekler | |
| API reference | API referansı | |
| Styling | Stil verme (başlık); "stil" (metin) | "Stilleme" yaygın değil. |
| Customization | Özelleştirme | |
| Guidelines | Kullanım ilkeleri | "Yönergeler" resmî kaçıyor. |
| Related | İlgili sayfalar | |
| Import | Import (başlık); "import et" (fiil) | Kod terimi; "içe aktar" kimse söylemiyor. |
| Theme (genel) | Tema | Doğal ve yaygın. |
| Theming | Tema oluşturma / markaya göre tema | |
| Density | Yoğunluk | |
| Right-to-left (RTL) | Sağdan sola (RTL) | İlk geçişte parantezle. |
| Forced colors / high contrast | Zorunlu renkler (forced colors) / yüksek kontrast | Windows'ta ayarın Türkçe adı "Kontrast temaları"; teknik terim parantezde kalır. |
| Reduced motion | Azaltılmış hareket | İşletim sistemlerindeki ayar adı. |
| Contributing | Katkıda bulunma | |
| License | Lisans | |
| Changelog (sayfa adı) | Sürüm notları | |
| Roadmap | Yol haritası | |
| Versioning | Sürümleme | |
| Browser support | Tarayıcı desteği | |
| Foundations | Temeller | |
| Color | Renk | |
| Typography | Tipografi | |
| Spacing | Boşluk | |
| Radius | Köşe yuvarlaklığı | |
| Elevation | Yükselti | Gölge ve katman derinliği. |
| Motion | Hareket | "Animasyon" daha dar bir kavram. |
| Principles | İlkeler | |
| Patterns | Desenler | "Kalıp" da olur; "desen" UI bağlamında daha doğal. |
| Integrations | Entegrasyonlar | |
| Empty state | Boş durum | |
| Loading state | Yükleniyor durumu | |
| Error message | Hata mesajı | |
| Helper text / description | Yardım metni / açıklama | |
| Label | Etiket (metinde); `label` (prop) | |
| Placeholder | Placeholder | Yerleşik; "yer tutucu" yalnızca Skeleton gibi görsel yer tutucular için. |
| Disabled | Devre dışı (metin); `disabled` (prop) | |
| Required | Zorunlu | |
| Invalid | Geçersiz | |
| Hairline | İnce çizgi | Merid'in 1px kenarlık dili. |
| Tray | Gri yüzey / tray | İlk geçişte "gri yüzey (tray)", token adı `--mrd-tray`. |
| Do / Avoid | Yap / Kaçın | Kısa ve emir kipinde, "sen" dili. |
| Note / Tip / Warning / Important | Not / İpucu / Uyarı / Önemli | |
| Stable / Beta / Planned / Deprecated | Kararlı / Beta / Planlandı / Kullanımdan kalktı | |
| Search | Ara | Buton ve kısayol etiketi. |
| On this page | Bu sayfada | |
| Previous / Next | Önceki / Sonraki | |
| Copy / Copied | Kopyala / Kopyalandı | |
| Preview / Code | Önizleme / Kod | |
| Screen reader | Ekran okuyucu | |
| Assistive technology | Yardımcı teknoloji | |
| Trigger (metin) | Tetikleyici | |
| Controlled / uncontrolled | Controlled / uncontrolled | React terimi, çevrilmez; gerekirse "dışarıdan yönetilen" açıklaması eklenir. |

## Örnek arayüz metinleri

Kod örneklerindeki arayüz metinleri Türkçeleşir, kod kalır. Aynı metin her yerde aynı çevrilir:

| İngilizce | Türkçe |
|---|---|
| Save changes | Değişiklikleri kaydet |
| Save | Kaydet |
| Cancel | Vazgeç |
| Delete | Sil |
| Delete project | Projeyi sil |
| Continue | Devam et |
| Close | Kapat |
| Edit | Düzenle |
| Create account | Hesap oluştur |
| Sign in / Log in | Giriş yap |
| Sign out | Çıkış yap |
| Email | E-posta |
| Password | Şifre |
| New project | Yeni proje |
| Invite / Send invite | Davet et / Davet gönder |
| Settings | Ayarlar |
| Profile | Profil |
| Billing | Faturalandırma |
| Team / Members | Ekip / Üyeler |
| Search | Ara |
| Open menu | Menüyü aç |
| Learn more | Daha fazla bilgi |
| Try again | Tekrar dene |
| Loading… | Yükleniyor… |
| Published | Yayında |
| Draft | Taslak |
| Owner / Admin / Viewer / Member | Sahip / Yönetici / İzleyici / Üye |

"Cancel" için "İptal" yerine **"Vazgeç"** kullanılır: iptal bir aksiyonu (siparişi, aboneliği) iptal etmekle karışıyor, "Vazgeç" dialog'u kapatmak için daha net.

Kişi adları (Ada Lovelace, Grace Hopper), proje adları (northwind-web) ve bölge kodları (eu-central) çevrilmez.
