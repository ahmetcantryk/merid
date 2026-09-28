export const PLANS = [
  { id: "hobby", name: "Hobby", price: 0, blurb: "For side projects.", features: ["1 project", "Community support", "Shared build queue"] },
  { id: "team", name: "Team", price: 49, blurb: "For product teams.", features: ["Unlimited projects", "2,500 compute hours", "Email support"] },
  { id: "scale", name: "Scale", price: 299, blurb: "For critical workloads.", features: ["SSO and audit logs", "99.99% uptime SLA", "Dedicated support"] },
] as const;

export type PlanId = (typeof PLANS)[number]["id"];
