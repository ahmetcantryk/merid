import { evaluate } from "@mdx-js/mdx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@meridui/react";
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { getDictionary, type Locale } from "@/lib/i18n";
import { useMDXComponents as baseMdxComponents } from "@/mdx-components";
import { visibleUrls } from "./index";
import { internalPath } from "./links";

type Align = "start" | "center" | "end";

/** GFM writes column alignment as `style={{ textAlign }}`; Merid cells take `align`. */
function alignOf(style: ComponentPropsWithoutRef<"td">["style"]): Align {
  const value = style?.textAlign;
  if (value === "center") return "center";
  if (value === "right" || value === "end") return "end";
  return "start";
}

/** Markdown tables rendered with the library's own Table: hairline frame, keyboard-scrollable region. */
function tableComponents(locale: Locale): MDXComponents {
  const label = getDictionary(locale).table.region;
  return {
    table: ({ children }: ComponentPropsWithoutRef<"table">) => (
      <Table scrollLabel={label} hoverable={false} className="content-table">
        {children}
      </Table>
    ),
    thead: ({ children }: ComponentPropsWithoutRef<"thead">) => <TableHead>{children}</TableHead>,
    tbody: ({ children }: ComponentPropsWithoutRef<"tbody">) => <TableBody>{children}</TableBody>,
    tr: ({ children }: ComponentPropsWithoutRef<"tr">) => <TableRow>{children}</TableRow>,
    th: ({ children, style }: ComponentPropsWithoutRef<"th">) => <TableHeader align={alignOf(style)}>{children}</TableHeader>,
    td: ({ children, style }: ComponentPropsWithoutRef<"td">) => <TableCell align={alignOf(style)}>{children}</TableCell>,
  };
}

/**
 * Links: absolute links to meridui.dev become site-relative, and links to content that is not
 * published yet render as plain text until it is (the link checker has already verified the
 * target exists).
 */
function linkComponents(base: MDXComponents): MDXComponents {
  const visible = visibleUrls();
  const BaseAnchor = base.a as (props: ComponentPropsWithoutRef<"a">) => ReactNode;
  function Anchor({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
    const path = internalPath(href);
    if (path === undefined) return <BaseAnchor href={href} {...rest}>{children}</BaseAnchor>;
    const isEntry = /^\/(tr\/)?(blog|compare)\/[^/]+$/.test(path) && !path.endsWith("rss.xml");
    if (isEntry && !visible.has(path)) return <span className="pending-link">{children}</span>;
    const hash = href.includes("#") ? `#${href.split("#")[1]}` : "";
    return <BaseAnchor href={`${path}${hash}`} {...rest}>{children}</BaseAnchor>;
  }
  return { a: Anchor };
}

/** Compiles an entry body at build time. Server-only: no MDX runtime reaches the client. */
export async function renderContent(body: string, file: string, locale: Locale) {
  const base = baseMdxComponents();
  const components = { ...base, ...tableComponents(locale), ...linkComponents(base) };
  try {
    const { default: Content } = await evaluate(body, { ...runtime, remarkPlugins: [remarkGfm], development: false });
    return <Content components={components} />;
  } catch (error) {
    throw new Error(`[content] ${file}: MDX failed to compile: ${(error as Error).message}`);
  }
}
