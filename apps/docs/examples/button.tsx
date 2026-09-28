"use client";

import { useState } from "react";
import { Button } from "@merid/react";
import { ArrowRightIcon, PlusIcon, TrashIcon } from "./icons";

export function ButtonDemo() {
  return (
    <>
      <Button variant="primary">Save changes</Button>
      <Button>Cancel</Button>
    </>
  );
}

export function ButtonVariants() {
  return (
    <>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="link">Link</Button>
    </>
  );
}

export function ButtonSizes() {
  return (
    <>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </>
  );
}

export function ButtonIcons() {
  return (
    <>
      <Button variant="primary" leadingIcon={<PlusIcon />}>
        New project
      </Button>
      <Button trailingIcon={<ArrowRightIcon />}>Continue</Button>
      <Button variant="danger" leadingIcon={<TrashIcon />}>
        Delete
      </Button>
    </>
  );
}

export function ButtonLoading() {
  const [saving, setSaving] = useState(false);
  return (
    <Button
      variant="primary"
      loading={saving}
      onClick={() => {
        setSaving(true);
        window.setTimeout(() => setSaving(false), 1500);
      }}
    >
      Save changes
    </Button>
  );
}

export function ButtonDisabled() {
  return (
    <>
      <Button variant="primary" disabled>
        Publish
      </Button>
      <Button disabled>Export</Button>
    </>
  );
}

export function ButtonFullWidth() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Button variant="primary" fullWidth>
        Create account
      </Button>
    </div>
  );
}
