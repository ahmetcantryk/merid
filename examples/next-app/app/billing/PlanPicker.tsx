"use client";

import { useState } from "react";
import { Badge, Button, Card, Grid, Radio, RadioGroup, Stack, Text } from "@meridui/react";
import { Check } from "lucide-react";
import { PLANS, type PlanId } from "@/lib/plans";

export function PlanPicker({ initialPlan }: { initialPlan: PlanId }) {
  const [current, setCurrent] = useState<PlanId>(initialPlan);
  const [plan, setPlan] = useState<PlanId>(initialPlan);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setCurrent(plan);
      }}
    >
      <Stack gap={6}>
        <RadioGroup aria-label="Plan" name="plan" value={plan} onValueChange={(v) => setPlan(v as PlanId)}>
          <Grid minItemWidth={240} gap={4}>
            {PLANS.map((p) => (
              // The Card is a larger pointer target; the Radio inside stays the keyboard/AT control.
              <Card key={p.id} padding="lg" interactive selected={plan === p.id} onClick={() => setPlan(p.id)} className="plan">
                <Stack gap={4}>
                  <Stack direction="row" justify="between" align="center">
                    <Radio value={p.id}>{p.name}</Radio>
                    {p.id === current ? <Badge tone="accent">Current</Badge> : null}
                  </Stack>
                  <Text as="p" tone="ink" className="plan__price">
                    ${p.price}<Text as="span" size="sm" tone="muted"> / month</Text>
                  </Text>
                  <Text size="sm" tone="muted">{p.blurb}</Text>
                  <ul className="plain-list plan__features">
                    {p.features.map((f) => (
                      <li key={f}>
                        <Check size={14} aria-hidden="true" />
                        <Text as="span" size="sm">{f}</Text>
                      </li>
                    ))}
                  </ul>
                </Stack>
              </Card>
            ))}
          </Grid>
        </RadioGroup>
        <Stack direction="row" gap={3} align="center" wrap>
          <Button type="submit" variant="primary" disabled={plan === current}>
            {plan === current ? "Current plan" : `Switch to ${PLANS.find((p) => p.id === plan)?.name}`}
          </Button>
          <Text size="sm" tone="muted" role="status">
            {plan === current ? `You are on ${PLANS.find((p) => p.id === current)?.name}.` : ""}
          </Text>
        </Stack>
      </Stack>
    </form>
  );
}
