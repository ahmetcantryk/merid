import { forwardRef, type ReactElement, type ReactNode, type Ref, version } from "react";

const REACT_MAJOR = Number.parseInt(version, 10);

/**
 * Lets a component written with React 19 `ref`-as-prop also receive refs on React 18,
 * where function components drop `ref`. forwardRef hands the ref back as a prop; the
 * public prop types are unchanged.
 */
export function withRef<P>(displayName: string, render: (props: P) => ReactNode): (props: P) => ReactNode {
  const Wrapped = forwardRef<unknown, P>((props, ref) =>
    render(ref == null ? (props as P) : ({ ...props, ref } as P)),
  );
  Wrapped.displayName = displayName;
  return Wrapped as unknown as (props: P) => ReactNode;
}

/** The ref attached to an element: `props.ref` on React 19, `element.ref` on React 18. */
export function getElementRef<T>(element: ReactElement): Ref<T> | undefined {
  // Each React major warns when the other location is read, so read only the right one.
  if (REACT_MAJOR >= 19) return (element.props as { ref?: Ref<T> } | null)?.ref;
  return (element as unknown as { ref?: Ref<T> | null }).ref ?? undefined;
}
