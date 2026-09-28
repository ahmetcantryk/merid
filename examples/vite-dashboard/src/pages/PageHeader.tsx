import type { ReactNode } from "react";
import { Heading, Text } from "@merid/react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="page-header">
      <div className="page-header__text">
        <Heading level={1} size="h3">{title}</Heading>
        {description ? <Text tone="muted">{description}</Text> : null}
      </div>
      {actions ? <div className="page-header__actions">{actions}</div> : null}
    </div>
  );
}
