

//to be remade
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

// External packages required by this component or page.
const requiredPackages = [
  "@radix-ui/react-collapsible:^1.1.11",
  "react:^19.2.4"
] as const;

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

