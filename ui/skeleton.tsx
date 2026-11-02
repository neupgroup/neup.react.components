

//to be remade
import { cn } from "@neup/core/utils"

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
