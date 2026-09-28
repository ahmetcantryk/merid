// Source strings shown in the docs code tabs. Kept out of the client module so server components can read them.

export const stepperBasicCode = `import { Stepper } from "@merid/react";

export function Example() {
  return (
    <Stepper.Root current={1} aria-label="Checkout progress">
      <Stepper.Step title="Account" />
      <Stepper.Step title="Shipping" />
      <Stepper.Step title="Payment" />
      <Stepper.Step title="Review" />
    </Stepper.Root>
  );
}`;


export const stepperVerticalCode = `<Stepper.Root current={2} orientation="vertical" aria-label="Onboarding">
  <Stepper.Step title="Create workspace" description="Name and region" />
  <Stepper.Step title="Invite team" description="Add up to 10 people" />
  <Stepper.Step title="Connect data" description="Import from CSV or an API" />
  <Stepper.Step title="Go live" />
</Stepper.Root>`;
