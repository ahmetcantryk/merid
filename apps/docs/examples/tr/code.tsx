"use client";

import { Code, Text } from "@meridui/react";

export function CodeDemo() {
  return (
    <Text>
      <Code>@meridui/react/styles.css</Code> stil dosyasını bir kez import et.
    </Text>
  );
}

const SNIPPET = 'npm i @meridui/react\nimport "@meridui/react/styles.css";';

export function CodeBlockDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <Code variant="block">{SNIPPET}</Code>
    </div>
  );
}
