// Converts the docs site's MDX pages into plain Markdown for llms.txt, per-page .md files and the MCP server.
// Build-time only. Node built-ins only. The input is this repository's own MDX, so JS literals in
// props (PropsTable rows, preview code) are evaluated in an empty vm context with a short timeout.
import { readFileSync } from "node:fs";
import vm from "node:vm";

/** `<AiRules />` in MDX renders this file; the Markdown output inlines it. */
const RULES_FILE = new URL("../rules.md", import.meta.url);

/** Evaluates a JS literal expression (array, object, string, template) with no globals. Returns undefined on failure. */
export function evalLiteral(expr) {
  try {
    return vm.runInNewContext(`(${expr})`, Object.create(null), { timeout: 50 });
  } catch {
    return undefined;
  }
}

const QUOTE_OPENERS = new Set(["(", ",", "=", ":", "[", "{", "?", "+", "!", "&", "|", ""]);

/** Index just past the expression that starts at `src[start] === "{"`, balancing braces, strings and templates. */
export function scanBraces(src, start) {
  let depth = 0;
  let i = start;
  let prev = "";
  while (i < src.length) {
    const ch = src[i];
    if (ch === "`") {
      i = scanTemplate(src, i + 1);
      prev = "`";
      continue;
    }
    // Quotes only start a string where JS expects a value; an apostrophe in JSX text ("don't") does not.
    if ((ch === '"' || ch === "'") && QUOTE_OPENERS.has(prev)) {
      i = scanString(src, i + 1, ch);
      prev = ch;
      continue;
    }
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
    if (!/\s/.test(ch)) prev = ch;
    i += 1;
  }
  return src.length;
}

function scanString(src, i, quote) {
  while (i < src.length) {
    if (src[i] === "\\") i += 2;
    else if (src[i] === quote) return i + 1;
    else i += 1;
  }
  return src.length;
}

function scanTemplate(src, i) {
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\\") {
      i += 2;
      continue;
    }
    if (ch === "`") return i + 1;
    if (ch === "$" && src[i + 1] === "{") {
      i = scanBraces(src, i + 1);
      continue;
    }
    i += 1;
  }
  return src.length;
}

/**
 * Parses the JSX element that starts at `src[start] === "<"`.
 * Returns `{ name, attrs, children, end }`; attrs map to `{ kind: "string" | "expr" | "bool", value }`.
 */
export function parseElement(src, start) {
  const nameMatch = /^<([A-Za-z][\w.]*)/.exec(src.slice(start));
  if (!nameMatch) return undefined;
  const name = nameMatch[1];
  let i = start + nameMatch[0].length;
  const attrs = {};
  while (i < src.length) {
    while (/\s/.test(src[i] ?? "")) i += 1;
    if (src.startsWith("/>", i)) return { name, attrs, children: "", end: i + 2 };
    if (src[i] === ">") {
      i += 1;
      break;
    }
    if (src[i] === "{") {
      i = scanBraces(src, i); // spread props
      continue;
    }
    const attr = /^[\w:.-]+/.exec(src.slice(i));
    if (!attr) return undefined;
    i += attr[0].length;
    if (src[i] !== "=") {
      attrs[attr[0]] = { kind: "bool", value: "true" };
      continue;
    }
    i += 1;
    if (src[i] === '"' || src[i] === "'") {
      const close = src.indexOf(src[i], i + 1);
      attrs[attr[0]] = { kind: "string", value: src.slice(i + 1, close) };
      i = close + 1;
    } else if (src[i] === "{") {
      const end = scanBraces(src, i);
      attrs[attr[0]] = { kind: "expr", value: src.slice(i + 1, end - 1).trim() };
      i = end;
    } else {
      return undefined;
    }
  }
  const closeTag = `</${name}>`;
  const openRe = new RegExp(`<${name.replace(/\./g, "\\.")}(?=[\\s>/])`, "g");
  let depth = 1;
  let j = i;
  while (depth > 0) {
    const close = src.indexOf(closeTag, j);
    if (close === -1) return { name, attrs, children: src.slice(i), end: src.length };
    openRe.lastIndex = j;
    let open;
    while ((open = openRe.exec(src)) && open.index < close) {
      const gt = src.indexOf(">", open.index);
      if (src[gt - 1] !== "/") depth += 1;
    }
    depth -= 1;
    j = close + closeTag.length;
    if (depth === 0) return { name, attrs, children: src.slice(i, close), end: j };
  }
  return { name, attrs, children: src.slice(i), end: src.length };
}

/** Inline JSX/HTML (in prop values, tables, callouts) to Markdown text. */
export function inlineToMarkdown(text) {
  return text
    .replace(/\{"([^"]*)"\}/g, "$1")
    .replace(/\{'([^']*)'\}/g, "$1")
    .replace(/\{`([^`]*)`\}/g, "$1")
    .replace(/<code>([\s\S]*?)<\/code>/g, "`$1`")
    .replace(/<kbd>([\s\S]*?)<\/kbd>/g, "`$1`")
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/g, "**$2**")
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/g, "_$2_")
    .replace(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, "[$2]($1)")
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<\/?(p|span|div|ul|ol|li|small)[^>]*>/g, " ")
    .replace(/<[A-Z][\w.]*[^>]*\/>/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .trim();
}

function attrText(attr) {
  if (!attr) return "";
  if (attr.kind === "string") return attr.value;
  const value = evalLiteral(attr.value);
  if (typeof value === "string") return value;
  return inlineToMarkdown(attr.value.replace(/^<>|<\/>$/g, ""));
}

const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ").trim();

function table(headers, rows) {
  const head = `| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |`;
  return [head, ...rows.map((r) => `| ${r.map(cell).join(" | ")} |`)].join("\n");
}

function htmlTable(src) {
  const rows = [...src.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) =>
    [...m[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((c) => inlineToMarkdown(c[1])),
  );
  if (rows.length === 0) return "";
  return table(rows[0], rows.slice(1));
}

/** Markdown for one parsed top-level element, or "" to drop it (live demos, decoration). */
function elementToMarkdown(el, labels) {
  switch (el.name) {
    case "ComponentPreview": {
      const code = attrText(el.attrs.code);
      return code ? "```tsx\n" + code.trim() + "\n```" : "";
    }
    case "PropsTable": {
      const rows = evalLiteral(el.attrs.rows?.value ?? "[]") ?? [];
      return table(
        labels.props,
        rows.map((r) => [`\`${r.name}\``, r.type ? `\`${r.type}\`` : "", r.default ? `\`${r.default}\`` : "", inlineToMarkdown(r.description ?? "")]),
      );
    }
    case "KeyboardTable": {
      const rows = evalLiteral(el.attrs.rows?.value ?? "[]") ?? [];
      return table(labels.keyboard, rows.map((r) => [r.keys.map((k) => `\`${k}\``).join(" "), r.action]));
    }
    case "DoDont":
      return `- **${labels.do}:** ${attrText(el.attrs.do)}\n- **${labels.dont}:** ${attrText(el.attrs.dont)}`;
    case "Callout": {
      const title = el.attrs.title ? `**${attrText(el.attrs.title)}.** ` : "";
      return `> ${title}${inlineToMarkdown(convertBody(el.children, labels))}`.replace(/\n/g, "\n> ");
    }
    case "AiRules":
      return "```md\n" + readFileSync(RULES_FILE, "utf8").trim() + "\n```";
    case "table":
      return htmlTable(el.children);
    case "div":
      if (el.attrs.className?.value === "doc-meta") return "";
      return convertBody(el.children, labels).trim();
    default:
      return "";
  }
}

/** Converts an MDX body (imports/exports already removed) to Markdown. */
function convertBody(src, labels) {
  const out = [];
  let i = 0;
  let lineStart = true;
  while (i < src.length) {
    if (lineStart && /^[ \t]*(```|~~~)/.test(src.slice(i, i + 12))) {
      const fenceMatch = /^[ \t]*(```+|~~~+)/.exec(src.slice(i));
      const fence = fenceMatch[1];
      const close = src.indexOf(`\n${fence}`, i + fenceMatch[0].length);
      const end = close === -1 ? src.length : src.indexOf("\n", close + 1 + fence.length);
      const stop = end === -1 ? src.length : end;
      out.push(src.slice(i, stop));
      i = stop;
      lineStart = false;
      continue;
    }
    if (lineStart) {
      const indent = /^[ \t]*/.exec(src.slice(i))[0];
      if (/^<[A-Za-z]/.test(src.slice(i + indent.length))) {
        const el = parseElement(src, i + indent.length);
        if (el) {
          out.push(elementToMarkdown(el, labels));
          i = el.end;
          lineStart = false;
          continue;
        }
      }
    }
    const ch = src[i];
    out.push(ch);
    lineStart = ch === "\n";
    i += 1;
  }
  return out.join("");
}

const LABELS = {
  en: { props: ["Prop", "Type", "Default", "Description"], keyboard: ["Keys", "Action"], do: "Do", dont: "Don't" },
  tr: { props: ["Prop", "Tip", "Varsayılan", "Açıklama"], keyboard: ["Tuşlar", "Eylem"], do: "Yap", dont: "Yapma" },
};

/** Removes `import` lines and `export const ... = ...;` blocks; returns the rest and the docMetadata title/description. */
export function stripModule(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const kept = [];
  let exportBuffer = null;
  let meta = {};
  let inFence = false;
  for (const line of lines) {
    const fenceLine = /^\s*(```|~~~)/.test(line);
    if (fenceLine) inFence = !inFence;
    if (inFence || fenceLine) {
      kept.push(line);
      continue;
    }
    if (exportBuffer !== null) {
      exportBuffer.push(line);
      if (/^\S.*;\s*$|^\}\);?\s*$|^\);?\s*$/.test(line)) {
        meta = { ...meta, ...metaOf(exportBuffer.join("\n")) };
        exportBuffer = null;
      }
      continue;
    }
    if (/^import\s/.test(line)) continue;
    if (/^export\s/.test(line)) {
      if (/;\s*$/.test(line)) meta = { ...meta, ...metaOf(line) };
      else exportBuffer = [line];
      continue;
    }
    kept.push(line);
  }
  return { body: kept.join("\n"), ...meta };
}

function metaOf(block) {
  const title = /title:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)/.exec(block);
  const description = /description:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)/.exec(block);
  return {
    ...(title ? { title: evalLiteral(title[1]) } : {}),
    ...(description ? { description: evalLiteral(description[1]) } : {}),
  };
}

/**
 * MDX page → `{ title, description, markdown }`. Live demos are dropped; preview code, props,
 * keyboard tables, do/don't pairs, callouts and HTML tables become Markdown.
 */
export function mdxToMarkdown(source, locale = "en") {
  const { body, title, description } = stripModule(source);
  const markdown = convertBody(body, LABELS[locale] ?? LABELS.en)
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { title: title ?? /^#\s+(.+)$/m.exec(markdown)?.[1] ?? "", description: description ?? "", markdown: markdown + "\n" };
}

/** Splits Markdown into `{ heading, text }` sections at h2. The part before the first h2 has heading "". */
export function sections(markdown) {
  const result = [];
  let current = { heading: "", lines: [] };
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^(```|~~~)/.test(line)) inFence = !inFence;
    const h2 = !inFence && /^##\s+(.+)$/.exec(line);
    if (h2) {
      result.push(current);
      current = { heading: h2[1].trim(), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  result.push(current);
  return result.map((s) => ({ heading: s.heading, text: s.lines.join("\n").trim() }));
}

/**
 * The npm scope moved from `@meridui/*` to `@meridui/*`. Generated AI content always uses the published
 * names, whichever the docs source still says; once the docs are renamed this is a no-op.
 */
export const publishedNames = (text) => text.replace(/@merid\/(react|tokens|cli|mcp)\b/g, "@meridui/$1");
