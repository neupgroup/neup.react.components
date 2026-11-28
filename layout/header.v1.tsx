"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@neup/components/elements/header/header";

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

type HeaderV1Props = {
  children: ReactNode;
};

export function HeaderV1({ children }: HeaderV1Props) {
  const searchParams = useSearchParams();
  if (searchParams.get('embedded') === 'true' && searchParams.get('app')?.trim()) return null;
  return <Header>{children}</Header>;
}
