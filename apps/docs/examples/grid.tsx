"use client";

import { Grid } from "@merid/react";
import { Box } from "./layout-box";

const items = (count: number) => Array.from({ length: count }, (_, i) => <Box key={i}>{i + 1}</Box>);

export function GridDemo() {
  return <Grid style={{ width: "100%" }}>{items(6)}</Grid>;
}

export function GridColumns() {
  return (
    <Grid columns={4} gap={3} style={{ width: "100%" }}>
      {items(8)}
    </Grid>
  );
}

export function GridAuto() {
  return (
    <Grid minItemWidth={140} gap={4} style={{ width: "100%" }}>
      {items(7)}
    </Grid>
  );
}
