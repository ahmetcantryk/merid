"use client";

import { useSyncExternalStore } from "react";
import { Stepper } from "@merid/react";
import { STEPS } from "@/lib/onboarding";

const NARROW = "(max-width: 640px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(NARROW);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// Client wrapper for two reasons: compound members (Stepper.Root / Stepper.Step) are undefined when
// dotted into from a server component, and on phones the horizontal stepper leaves the current
// title too little room, so it switches to vertical below 640px.
export function OnboardingStepper({ current }: { current: number }) {
  const narrow = useSyncExternalStore(subscribe, () => window.matchMedia(NARROW).matches, () => false);
  return (
    <Stepper.Root current={current} orientation={narrow ? "vertical" : "horizontal"} aria-label="Onboarding progress">
      {STEPS.map((s) => (
        <Stepper.Step key={s.title} title={s.title} description={s.description} />
      ))}
    </Stepper.Root>
  );
}
