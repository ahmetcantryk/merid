"use client";

import { Code, Text } from "@merid/react";

export function CodeDemo() {
  return (
    <Text>
      Import the stylesheet once with <Code>@merid/react/styles.css</Code>.
    </Text>
  );
}

const SNIPPET = 'npm i @merid/react\nimport "@merid/react/styles.css";';

export function CodeBlockDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <Code variant="block">{SNIPPET}</Code>
    </div>
  );
}
