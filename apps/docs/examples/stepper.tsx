"use client";

import { Stepper } from "@merid/react";

export function StepperBasic() {
  return (
    <Stepper.Root current={1} aria-label="Checkout progress" style={{ width: "100%" }}>
      <Stepper.Step title="Account" />
      <Stepper.Step title="Shipping" />
      <Stepper.Step title="Payment" />
      <Stepper.Step title="Review" />
    </Stepper.Root>
  );
}

export function StepperVertical() {
  return (
    <Stepper.Root current={2} orientation="vertical" aria-label="Onboarding">
      <Stepper.Step title="Create workspace" description="Name and region" />
      <Stepper.Step title="Invite team" description="Add up to 10 people" />
      <Stepper.Step title="Connect data" description="Import from CSV or an API" />
      <Stepper.Step title="Go live" />
    </Stepper.Root>
  );
}
