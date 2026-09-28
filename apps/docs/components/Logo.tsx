interface LogoMarkProps {
  readonly size?: number;
  readonly title?: string;
}

/**
 * The Merid mark: a hairline circle crossed by one accent meridian.
 * The circle follows currentColor, so it adapts to light, dark and mono contexts.
 */
export function LogoMark({ size = 22, title }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className="logo-mark"
    >
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 1.5C15.6 5 17 8.4 17 12s-1.4 7-5 10.5"
        stroke="var(--logo-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-word">merid</span>
    </span>
  );
}
