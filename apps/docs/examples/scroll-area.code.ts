export const scrollAreaBasicCode = `import { ScrollArea } from "@meridui/react";

export function Example() {
  return (
    <ScrollArea maxHeight={200} label="Release history">
      <ul>
        {releases.map((release) => (
          <li key={release}>{release}</li>
        ))}
      </ul>
    </ScrollArea>
  );
}`;

export const scrollAreaHorizontalCode = `<ScrollArea orientation="horizontal" autoHide label="Tags">
  <div style={{ display: "flex", gap: 8, width: "max-content" }}>
    {tags.map((tag) => (
      <Badge key={tag}>{tag}</Badge>
    ))}
  </div>
</ScrollArea>`;
