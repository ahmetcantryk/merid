import { highlight } from "@/lib/highlight";
import { CodeFrame } from "./CodeFrame";

interface CodeBlockProps {
  readonly code: string;
  readonly lang?: string;
  readonly title?: string;
}

export async function CodeBlock({ code, lang = "tsx", title }: CodeBlockProps) {
  const html = await highlight(code, lang);
  return <CodeFrame html={html} code={code.replace(/\n$/, "")} lang={lang} title={title} />;
}
