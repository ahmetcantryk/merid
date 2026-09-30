import { useState } from "react";
import { Alert, Button, Card, Heading, Radio, RadioGroup, Stack, Text, useToast } from "@meridui/react";

const PLANS = [
  { value: "hobby", label: "Hobby", price: "$0", description: "1 project, community support." },
  { value: "team", label: "Team", price: "$49 / month", description: "Unlimited projects, 2,500 compute hours." },
  { value: "scale", label: "Scale", price: "$299 / month", description: "SSO, audit logs and a 99.99% SLA." },
] as const;

type Plan = (typeof PLANS)[number]["value"];

export function BillingTab() {
  const { toast } = useToast();
  const [current, setCurrent] = useState<Plan>("team");
  const [plan, setPlan] = useState<Plan>("team");
  const changed = plan !== current;

  return (
    <Stack gap={6}>
      <Alert tone="info" title="Your cycle renews on October 1">
        Usage above your plan limits is billed at the end of the cycle.
      </Alert>
      <Card padding="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrent(plan);
            toast({ tone: "success", title: "Plan updated", description: `You are now on ${PLANS.find((p) => p.value === plan)?.label}.` });
          }}
        >
          <Stack gap={5}>
            <Stack gap={1}>
              <Heading level={2} size="sm" id="plan-heading">Plan</Heading>
              <Text size="sm" tone="muted">Changes apply immediately and are prorated.</Text>
            </Stack>
            <RadioGroup aria-labelledby="plan-heading" name="plan" value={plan} onValueChange={(v) => setPlan(v as Plan)}>
              {PLANS.map((p) => (
                <Radio key={p.value} value={p.value} description={`${p.price} · ${p.description}`}>
                  {p.label}
                  {p.value === current ? <Text as="span" size="xs" tone="muted"> (current)</Text> : null}
                </Radio>
              ))}
            </RadioGroup>
            <div>
              <Button type="submit" variant="primary" disabled={!changed}>
                {changed ? "Switch plan" : "Current plan"}
              </Button>
            </div>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
