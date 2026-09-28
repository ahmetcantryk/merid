import type { ReactNode } from "react";

interface DoDontProps {
  readonly do: ReactNode;
  readonly dont: ReactNode;
  readonly doTitle?: string;
  readonly dontTitle?: string;
}

export function DoDont({ do: good, dont: bad, doTitle = "Do", dontTitle = "Avoid" }: DoDontProps) {
  return (
    <div className="do-dont">
      <section className="do-dont__item" data-kind="do">
        <p className="do-dont__label">{doTitle}</p>
        <div className="do-dont__content">{good}</div>
      </section>
      <section className="do-dont__item" data-kind="dont">
        <p className="do-dont__label">{dontTitle}</p>
        <div className="do-dont__content">{bad}</div>
      </section>
    </div>
  );
}
