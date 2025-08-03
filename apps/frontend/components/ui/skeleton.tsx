import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted",
  {
    variants: {
      variant: {
        default: "bg-muted",
        card: "bg-gradient-to-br from-muted via-muted/30 to-muted/60",
        text: "bg-muted/60",
        avatar: "rounded-full bg-gradient-to-br from-muted to-muted/40",
        button: "bg-gradient-to-r from-muted to-muted/70 rounded-lg",
        image: "bg-gradient-to-br from-muted/40 via-muted/60 to-muted/40",
      },
      size: {
        sm: "h-4",
        default: "h-6",
        lg: "h-8",
        xl: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, size, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

// Predefined skeleton components for common use cases
const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-3 p-6", className)} {...props}>
    <Skeleton variant="card" className="h-4 w-3/4" />
    <Skeleton variant="text" className="h-3 w-1/2" />
    <div className="space-y-2">
      <Skeleton variant="text" className="h-3 w-full" />
      <Skeleton variant="text" className="h-3 w-4/5" />
    </div>
  </div>
))
SkeletonCard.displayName = "SkeletonCard"

const SkeletonList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { items?: number }
>(({ className, items = 3, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-3", className)} {...props}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3">
        <Skeleton variant="avatar" className="h-10 w-10" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="h-3 w-3/4" />
          <Skeleton variant="text" className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
))
SkeletonList.displayName = "SkeletonList"

const SkeletonMatch = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-4 space-x-4", className)}
    {...props}
  >
    <div className="flex items-center space-x-3">
      <Skeleton variant="avatar" className="h-8 w-8" />
      <Skeleton variant="text" className="h-4 w-16" />
    </div>
    <div className="flex items-center space-x-2">
      <Skeleton variant="text" className="h-6 w-8" />
      <Skeleton variant="text" className="h-4 w-4" />
      <Skeleton variant="text" className="h-6 w-8" />
    </div>
    <div className="flex items-center space-x-3">
      <Skeleton variant="text" className="h-4 w-16" />
      <Skeleton variant="avatar" className="h-8 w-8" />
    </div>
  </div>
))
SkeletonMatch.displayName = "SkeletonMatch"

export { Skeleton, SkeletonCard, SkeletonList, SkeletonMatch, skeletonVariants }
