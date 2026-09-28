# Northwind Cloud site (Next.js App Router + Merid)

A marketing-lite site, auth screens, settings, billing and an onboarding wizard for the fictional **Northwind Cloud**, built with `@merid/react` on Next.js 16 (App Router, React 19). Pages are **server components by default**; client files exist only where there is state or an event handler.

## Run

From the repository root (npm workspaces link `@merid/react` automatically):

```bash
npm install
npm run build -w @merid/react                 # the example consumes the built package
npm run dev -w merid-example-next-app         # http://localhost:3230
```

Also: `npm run typecheck -w merid-example-next-app`, `npm run build -w merid-example-next-app`.

Demo inputs: sign up with `taken@northwind.example` to get a server-side field error; log in with the password `wrong-password` to get a form-level error. Any other valid input succeeds.

## What this example demonstrates

- **RSC compatibility**: `Card`, `Grid`, `Stack`, `Heading`, `Text`, `Badge`, `Section`, `Container`, `Avatar`, `Separator`, `Switch` (uncontrolled) and `Tooltip` are rendered straight from server components (`app/page.tsx`, `app/settings/notifications/page.tsx`, `app/onboarding/[step]/page.tsx`). The package's `"use client"` banner makes them client references.
- **Auth** (`/login`, `/signup`): react-hook-form + zod on the client (a 20-line resolver in `lib/zod-resolver.ts`), the **same schema re-checked in a server action** (`lib/auth-actions.ts`), and server errors mapped back onto `Field` errors or an `Alert`.
- **Nested layout** (`/settings`): a persistent layout with `Breadcrumb` (links rendered through `next/link` via `as`) and route-driven `Tabs` whose value is the pathname.
- **Billing** (`/billing`): plan `Card`s with `selected`/`interactive` wrapping a `RadioGroup`, so the whole card is a pointer target and the radios stay the keyboard control.
- **Onboarding** (`/onboarding/[step]`): statically generated steps with `Stepper`; each step is a URL so Back/refresh work.
- **Mobile nav**: a `Drawer` holding `SidebarNav` with `next/link` passed through `as`.
- **Theme**: a no-flash inline script plus a `ThemeToggle` (`IconButton` + `Tooltip`) writing `<html data-theme>`.
- Link-styled-as-button through `lib/button-link.ts`, light/dark, responsive down to 390px.

## RSC notes (what we learned)

- **Compound members cannot be used from server components.** `Stepper.Root`, `Breadcrumb.Link`, `Tabs.*` and friends are properties of an object exported from a client module, and they resolve to `undefined` across the server/client boundary. Use them from a small `"use client"` file (see `components/OnboardingStepper.tsx`, `app/settings/SettingsBreadcrumb.tsx`).
- **`as={Link}` needs a client file.** Passing a component (a function) as a prop from a server component to a client component is not allowed.
- `Button` has no `asChild`/`as`, so a link that looks like a button uses the Button's data-attribute contract (`lib/button-link.ts`).
- Merid does not reset `box-sizing`; `globals.css` sets it, and `<body class="mrd-root">` applies base font and colours.
