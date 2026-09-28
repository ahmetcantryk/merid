import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { ComponentPreview } from "@/components/ComponentPreview";
import { DoDont } from "@/components/DoDont";
import { KeyboardTable } from "@/components/KeyboardTable";
import { PropsTable } from "@/components/PropsTable";
import { StatusBadge } from "@/components/StatusBadge";
import { slugify, textOf } from "@/lib/slug";

function Heading({ level, children }: { readonly level: 2 | 3; readonly children?: ReactNode }) {
  const id = slugify(textOf(children));
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag id={id}>
      <a href={`#${id}`} className="heading-anchor">
        {children}
      </a>
    </Tag>
  );
}

function Anchor({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) return <Link href={href} {...rest}>{children}</Link>;
  if (href.startsWith("#")) return <a href={href} {...rest}>{children}</a>;
  return (
    <a href={href} rel="noreferrer" {...rest}>
      {children}
    </a>
  );
}

function Pre({ children }: ComponentPropsWithoutRef<"pre">) {
  if (isValidElement<{ className?: string; children?: ReactNode }>(children)) {
    const lang = children.props.className?.replace("language-", "");
    return <CodeBlock code={textOf(children.props.children)} lang={lang} />;
  }
  return <pre>{children}</pre>;
}

const components: MDXComponents = {
  h2: ({ children }) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }) => <Heading level={3}>{children}</Heading>,
  a: Anchor,
  pre: Pre,
  table: (props) => (
    <div className="table-wrap" tabIndex={0} role="region" aria-label="Table">
      <table className="doc-table" {...props} />
    </div>
  ),
  Callout,
  CodeBlock,
  ComponentPreview,
  DoDont,
  KeyboardTable,
  PropsTable,
  StatusBadge,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
