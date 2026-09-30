# Northwind Cloud site (Next.js App Router + Merid)

A marketing-lite site, auth screens, settings, billing and an onboarding wizard for the fictional **Northwind Cloud**, built with `@meridui/react` on Next.js 16 (App Router, React 19). Pages are **server components by default**; client files exist only where there is state or an event handler.

## Run

From the repository root (npm workspaces link `@meridui/react` automatically):

```bash
npm install
npm run build -w @meridui/react                 # the example consumes the built package
npm run dev -w merid-example-next-app         # http://localhost:3230
```

Also: `npm run typecheck -w merid-example-next-app`, `npm run build -w merid-example-next-app`.

Demo inputs: sign up with `taken@northwind.example` to get a server-side field error; log in with the password `wrong-password` to get a form-level error. Any other valid input succeeds.

## What this example demonstrates

- **RSC compatibility**: `Card`, `Grid`, `Stack`, `Heading`, `Text`, `Badge`, `Section`, `Container`, `Avatar`, `Separator`, `Switch` (uncontrolled) and `Tooltip` are rendered straight from server components (`app/page.tsx`, `app/settings/notifications/page.tsx`, `app/onboarding/[step]/page.tsx`). The package's `"use client"` banner makes them client references.
- **Auth** (`/login`, `/signup`): react-hook-form + zod on the client (a 20-line resolver in `lib/zod-resolver.ts`), the **same schema re-checked in a server action** (`lib/auth-actions.ts`), and server errors mapped back onto `Field` errors or an `Alert`.
- **Nested layout** (`/settings`): a persistent server layout with `BreadcrumbRoot` / `BreadcrumbLink asChild` wrapping `next/link`, and route-driven `Tabs` whose value is the pathname.
- **Billing** (`/billing`): plan `Card`s with `selected`/`interactive` wrapping a `RadioGroup`, so the whole card is a pointer target and the radios stay the keyboard control.
- **Onboarding** (`/onboarding/[step]`): statically generated server pages rendering `StepperRoot` / `StepperStep` directly; each step is a URL so Back/refresh work. The horizontal stepper goes compact on its own in narrow columns.
- **Mobile nav**: a `Drawer` holding `SidebarNav` with `next/link` passed through `as`.
- **Theme**: a no-flash inline script plus a `ThemeToggle` (`IconButton` + `Tooltip`) writing `<html data-theme>`.
- Router links styled as buttons with `<Button asChild><Link …/></Button>`, light/dark, responsive down to 390px.

## RSC notes (what we learned)

- **Use flat names in server components.** `Stepper.Root`, `Breadcrumb.Link`, `Tabs.*` and friends are properties of an object exported from a client module and resolve to `undefined` across the server/client boundary. Every part also has a flat export (`StepperRoot`, `BreadcrumbLink`, `TabsList`, …) that works anywhere; client files may use either form.
- **Use `asChild`, not `as={Link}`, in server components.** Passing a component (a function) as a prop from a server component to a client component is not allowed; `asChild` takes the link as a child element instead (`Button`, `Link`, `BreadcrumbLink`).
- No app-level reset is needed: Merid's base layer sets `box-sizing` and the document font and colours at zero specificity.
