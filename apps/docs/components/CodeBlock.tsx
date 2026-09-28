import { highlight } from "@/lib/highlight";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  readonly code: string;
  readonly lang?: string;
  readonly title?: string;
}

export async function CodeBlock({ code, lang = "tsx", title }: CodeBlockProps) {
  const html = await highlight(code, lang);
  return (
    <figure className="code-block">
      <div className="code-block__bar">
        <span className="code-block__title">{title ?? lang}</span>
        <CopyButton value={code.replace(/\n$/, "")} />
      </div>
      <div className="code-block__body" dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
