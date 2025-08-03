import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

const statCardVariants = cva(
  "transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group",
  {
    variants: {
      variant: {
        default: "border hover:border-football-green/30",
        gradient:
          "bg-gradient-to-br from-football-green/10 to-football-blue/10 border-football-green/20 hover:border-football-green/40",
        minimal: "border-0 bg-muted/50 hover:bg-muted",
        featured:
          "border-2 border-football-orange/20 hover:border-football-orange/40 bg-gradient-to-br from-football-orange/5 to-football-green/5",
      },
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const valueVariants = cva(
  "font-bold transition-all duration-200 group-hover:scale-110",
  {
    variants: {
      size: {
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-4xl",
      },
      color: {
        default: "text-foreground",
        green: "text-football-green",
        blue: "text-football-blue",
        orange: "text-football-orange",
        gradient:
          "bg-gradient-to-r from-football-green to-football-blue bg-clip-text text-transparent",
      },
    },
    defaultVariants: {
      size: "md",
      color: "default",
    },
  }
)

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  value: string | number
  label: string
  icon?: React.ReactNode
  description?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  animated?: boolean
  valueColor?: "default" | "green" | "blue" | "orange" | "gradient"
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      value,
      label,
      icon,
      description,
      trend,
      trendValue,
      animated = true,
      valueColor = "default",
      variant = "default",
      size = "md",
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState(animated ? 0 : value)
    const [isVisible, setIsVisible] = React.useState(false)
    const cardRef = React.useRef<HTMLDivElement>(null)

    // Combine refs
    React.useImperativeHandle(ref, () => cardRef.current!)

    // Intersection Observer for animation trigger
    React.useEffect(() => {
      if (!animated || typeof value !== "number") return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
          }
        },
        { threshold: 0.1 }
      )

      if (cardRef.current) {
        observer.observe(cardRef.current)
      }

      return () => observer.disconnect()
    }, [animated, isVisible, value])

    // Animate counter
    React.useEffect(() => {
      if (!isVisible || !animated || typeof value !== "number") return

      const duration = 2000 // 2 seconds
      const steps = 60
      const stepValue = value / steps
      const stepDuration = duration / steps

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        const newValue = Math.min(Math.round(stepValue * currentStep), value)
        setDisplayValue(newValue)

        if (currentStep >= steps) {
          clearInterval(timer)
        }
      }, stepDuration)

      return () => clearInterval(timer)
    }, [isVisible, animated, value])

    const getTrendIcon = () => {
      switch (trend) {
        case "up":
          return <span className="text-green-500">↗</span>
        case "down":
          return <span className="text-red-500">↘</span>
        case "neutral":
          return <span className="text-muted-foreground">→</span>
        default:
          return null
      }
    }

    const getTrendColor = () => {
      switch (trend) {
        case "up":
          return "text-green-500"
        case "down":
          return "text-red-500"
        case "neutral":
          return "text-muted-foreground"
        default:
          return "text-muted-foreground"
      }
    }

    return (
      <Card
        ref={cardRef}
        className={cn(statCardVariants({ variant, size }), className)}
        {...props}
      >
        <CardContent
          className={cn(
            "flex flex-col gap-2",
            size === "sm" && "p-3",
            size === "md" && "p-4",
            size === "lg" && "p-6"
          )}
        >
          {/* Header with icon and trend */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon && (
                <div className="text-football-green group-hover:scale-110 transition-transform duration-200">
                  {icon}
                </div>
              )}
              <span
                className={cn(
                  "font-medium text-muted-foreground",
                  size === "sm" && "text-xs",
                  size === "md" && "text-sm",
                  size === "lg" && "text-base"
                )}
              >
                {label}
              </span>
            </div>

            {trend && trendValue && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={cn("text-xs font-medium", getTrendColor())}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>

          {/* Main value */}
          <div className={cn(valueVariants({ size, color: valueColor }))}>
            {animated && typeof value === "number"
              ? displayValue.toLocaleString()
              : value}
          </div>

          {/* Description */}
          {description && (
            <p
              className={cn(
                "text-muted-foreground",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                size === "lg" && "text-base"
              )}
            >
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }
)

StatCard.displayName = "StatCard"

export { StatCard, statCardVariants }
