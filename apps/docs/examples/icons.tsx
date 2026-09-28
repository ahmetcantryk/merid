// Small stroke icons used by the component examples. 16px, currentColor.
import type { SVGProps } from "react";

function Svg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

export const PlusIcon = () => (
  <Svg>
    <path d="M8 3v10M3 8h10" />
  </Svg>
);

export const ArrowRightIcon = () => (
  <Svg>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </Svg>
);

export const SearchIcon = () => (
  <Svg>
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </Svg>
);

export const TrashIcon = () => (
  <Svg>
    <path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" />
  </Svg>
);

export const CloseIcon = () => (
  <Svg>
    <path d="M4 4l8 8M12 4l-8 8" />
  </Svg>
);

export const SettingsIcon = () => (
  <Svg>
    <circle cx="8" cy="8" r="2" />
    <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" />
  </Svg>
);

export const InboxIcon = () => (
  <Svg width="20" height="20">
    <path d="M2 9l2-5.5h8L14 9v4H2V9z" />
    <path d="M2 9h3.5l1 1.5h3l1-1.5H14" />
  </Svg>
);

export const ListIcon = () => (
  <Svg>
    <path d="M5.5 4h8M5.5 8h8M5.5 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01" />
  </Svg>
);

export const GridIcon = () => (
  <Svg>
    <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
  </Svg>
);
