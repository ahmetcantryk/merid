/**
 * English strings for the blog, comparison pages, privacy page and the landing token studio.
 * Kept apart from `en.ts` so launch work does not collide with other dictionary edits.
 */
export const launchEn = {
  footer: {
    blog: "Blog",
    compare: "Comparisons",
    privacy: "Privacy",
  },
  tags: {
    comparisons: "Comparisons",
    "ai-coding": "AI coding",
    css: "CSS",
    accessibility: "Accessibility",
    theming: "Theming",
    "design-tokens": "Design tokens",
    "server-components": "Server components",
  },
  blog: {
    title: "Blog",
    metaTitle: "Blog: React UI, design tokens and AI coding",
    description:
      "Notes from building Merid: React component libraries compared, design tokens, CSS cascade layers, accessibility and keeping AI-written UI consistent.",
    lead: "Notes from building Merid: libraries compared, tokens and cascade layers, accessibility, and keeping AI-written UI consistent.",
    allPosts: "All posts",
    tagsLabel: "Topics",
    tagTitle: (tag: string) => `Posts about ${tag}`,
    tagDescription: (tag: string) => `Merid blog posts about ${tag}: React components, design tokens and CSS.`,
    empty: "No posts yet. The first ones are on their way.",
    emptyOther: "Meanwhile, the Turkish blog has posts.",
    otherBlog: "Türkçe blog",
    rss: "RSS feed",
    minutes: (n: number) => `${n} min read`,
    updated: "Updated",
    lastReviewed: "Last reviewed",
    scheduled: "Scheduled",
    scheduledNote: (date: string) => `Preview: this post is scheduled for ${date} and is not public yet.`,
    related: "Related posts",
    breadcrumb: "Breadcrumb",
    home: "Home",
    by: "By",
    readPost: "Read",
    ctaTitle: "Try Merid",
    ctaText: "Accessible React components in plain CSS. MIT licensed.",
    ctaDocs: "Read the docs",
    ctaGithub: "Star on GitHub",
    pendingLinkNote: "Links to posts that are not published yet appear as plain text.",
  },
  compare: {
    title: "Comparisons",
    metaTitle: "Merid compared with other React libraries",
    description:
      "Side-by-side comparisons of Merid with shadcn/ui, MUI, Chakra UI, Mantine and Radix Themes: styling model, theming, accessibility and maturity.",
    lead: "Merid next to the libraries people usually weigh it against. Each page names where the other library is ahead and links its sources.",
    disclosure: "We build Merid. These pages try to describe each library the way its own users would, and link the sources they rely on. If something is wrong or out of date, open an issue and we will fix it.",
    reportIssue: "Report an inaccuracy",
    empty: "No comparisons published yet.",
    read: "Read comparison",
  },
  privacy: {
    title: "Privacy",
    description: "What meridui.dev measures, which tools it uses, what it does not collect, and how to reach us. No cookies, no ads, no tracking across sites.",
  },
};
