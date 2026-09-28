"use client";

import { Skeleton, Stack } from "@merid/react";

export function SkeletonDemo() {
  return (
    <Stack direction="row" gap={3} align="center" aria-busy="true" style={{ width: "100%", maxWidth: 360 }}>
      <Skeleton circle width={40} height={40} />
      <Stack gap={2} style={{ flex: 1 }}>
        <Skeleton width="60%" />
        <Skeleton width="90%" height={12} />
      </Stack>
    </Stack>
  );
}

export function SkeletonText() {
  return (
    <Stack gap={2} aria-busy="true" style={{ width: "100%", maxWidth: 420 }}>
      <Skeleton height={24} width="50%" />
      <Skeleton />
      <Skeleton />
      <Skeleton width="75%" />
    </Stack>
  );
}

export function SkeletonShapes() {
  return (
    <>
      <Skeleton width={120} height={80} />
      <Skeleton circle width={48} height={48} />
      <Skeleton width={96} height={36} />
    </>
  );
}
