"use client";

import { usePageview } from "@/lib/analytics/usePageview";

export function PageviewListener() {
  usePageview();
  return null;
}
