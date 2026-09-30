import type { Dictionary } from "./en";

/** Turkish counterpart of `launch.en.ts`. Terminology follows GLOSSARY.tr.md. */
export const launchTr: Dictionary["launch"] = {
  footer: {
    blog: "Blog",
    compare: "Karşılaştırmalar",
    privacy: "Gizlilik",
  },
  tags: {
    comparisons: "Karşılaştırmalar",
    "ai-coding": "Yapay zeka ile kodlama",
    css: "CSS",
    accessibility: "Erişilebilirlik",
    theming: "Tema",
    "design-tokens": "Design token'lar",
    "server-components": "Server component'ler",
  },
  blog: {
    title: "Blog",
    metaTitle: "Blog: React arayüzü, design token ve yapay zeka",
    description:
      "Merid'i geliştirirken yazdıklarımız: React component kütüphaneleri, design token'lar, CSS cascade layer'lar, erişilebilirlik ve yapay zekayla tutarlı arayüz.",
    lead: "Merid'i geliştirirken yazdıklarımız: kütüphane karşılaştırmaları, token'lar ve cascade layer'lar, erişilebilirlik ve yapay zekanın yazdığı arayüzü tutarlı tutmak.",
    allPosts: "Tüm yazılar",
    tagsLabel: "Konular",
    tagTitle: (tag: string) => `${tag} yazıları`,
    tagDescription: (tag: string) => `Merid blogunda ${tag} üzerine yazılar: React component'leri, design token'lar ve CSS.`,
    empty: "Henüz Türkçe yazı yayımlanmadı. İlk yazılar yolda.",
    emptyOther: "Bu arada İngilizce blogda yazılar var.",
    otherBlog: "English blog",
    rss: "RSS akışı",
    minutes: (n: number) => `${n} dk okuma`,
    updated: "Güncellendi",
    lastReviewed: "Son kontrol",
    scheduled: "Planlandı",
    scheduledNote: (date: string) => `Önizleme: bu yazı ${date} tarihinde yayımlanacak, henüz herkese açık değil.`,
    related: "İlgili yazılar",
    breadcrumb: "Sayfa yolu",
    home: "Ana sayfa",
    by: "Yazar",
    readPost: "Oku",
    ctaTitle: "Merid'i dene",
    ctaText: "Sade CSS ve tek bir token setiyle erişilebilir React component'leri. MIT lisanslı.",
    ctaDocs: "Dokümanları oku",
    ctaGithub: "GitHub'da yıldızla",
    pendingLinkNote: "Henüz yayımlanmamış yazılara verilen bağlantılar düz metin olarak görünür.",
  },
  compare: {
    title: "Karşılaştırmalar",
    metaTitle: "Merid ve diğer React kütüphaneleri",
    description:
      "Merid'in shadcn/ui, MUI, Chakra UI, Mantine ve Radix Themes ile karşılaştırması: stil modeli, tema, erişilebilirlik ve olgunluk.",
    lead: "Merid'i genellikle yanına koyulduğu kütüphanelerle karşılaştırıyoruz. Her sayfa diğer kütüphanenin önde olduğu yerleri söyler ve kaynaklarını verir.",
    disclosure: "Merid'i biz geliştiriyoruz. Bu sayfalar her kütüphaneyi kendi kullanıcılarının anlatacağı gibi anlatmaya çalışır ve dayandığı kaynakları verir. Yanlış ya da eskimiş bir bilgi görürsen issue aç, düzeltelim.",
    reportIssue: "Hata bildir",
    empty: "Henüz yayımlanmış karşılaştırma yok.",
    read: "Karşılaştırmayı oku",
  },
  privacy: {
    title: "Gizlilik",
    description: "meridui.dev neyi ölçer, hangi araçları kullanır, neyi toplamaz ve bize nasıl ulaşırsın. Çerez yok, reklam yok, siteler arası takip yok.",
  },
};
