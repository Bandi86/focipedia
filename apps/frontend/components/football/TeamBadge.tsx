import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { type Team } from "@/lib/mock-data"

const teamBadgeVariants = cva(
  "inline-flex items-center gap-2 transition-all duration-200 group",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      variant: {
        default: "hover:scale-105",
        compact: "hover:scale-105",
        detailed: "p-2 rounded-lg border hover:shadow-md hover:scale-105",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

const getAvatarSize = (size: "sm" | "md" | "lg" | null) => {
  switch (size) {
    case "sm":
      return "sm"
    case "md":
      return "default"
    case "lg":
      return "lg"
    default:
      return "default"
  }
}

export interface TeamBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof teamBadgeVariants> {
  team: Team
  showName?: boolean
  showShortName?: boolean
}

const TeamBadge = React.forwardRef<HTMLDivElement, TeamBadgeProps>(
  (
    {
      className,
      team,
      size = "md",
      variant = "default",
      showName = false,
      showShortName = false,
      style,
      ...props
    },
    ref
  ) => {
    const avatarSize = getAvatarSize(size)

    // Create dynamic styles for team colors
    const teamColorStyles = {
      ...style,
      "--team-primary": team.colors.primary,
      "--team-secondary": team.colors.secondary,
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={cn(teamBadgeVariants({ size, variant }), className)}
        style={teamColorStyles}
        {...props}
      >
        <Avatar
          size={avatarSize}
          variant="team"
          className="ring-2 ring-[var(--team-primary)]/20 hover:ring-[var(--team-primary)]/40 transition-all duration-200"
        >
          <AvatarImage
            src={team.logo}
            alt={`${team.name} logo`}
            className="object-contain p-1"
          />
          <AvatarFallback
            className="text-white font-bold"
            style={{
              background: `linear-gradient(135deg, ${team.colors.primary}, ${team.colors.secondary})`,
            }}
          >
            {team.shortName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        {(showName || showShortName) && (
          <div className="flex flex-col">
            {showName && (
              <span
                className={cn(
                  "font-semibold text-foreground group-hover:text-[var(--team-primary)] transition-colors duration-200",
                  size === "sm" && "text-xs",
                  size === "md" && "text-sm",
                  size === "lg" && "text-base"
                )}
              >
                {team.name}
              </span>
            )}
            {showShortName && !showName && (
              <span
                className={cn(
                  "font-medium text-muted-foreground group-hover:text-[var(--team-primary)] transition-colors duration-200",
                  size === "sm" && "text-xs",
                  size === "md" && "text-sm",
                  size === "lg" && "text-base"
                )}
              >
                {team.shortName}
              </span>
            )}
            {showName && showShortName && (
              <span
                className={cn(
                  "text-muted-foreground group-hover:text-[var(--team-secondary)] transition-colors duration-200",
                  size === "sm" && "text-xs",
                  size === "md" && "text-xs",
                  size === "lg" && "text-sm"
                )}
              >
                {team.shortName}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

TeamBadge.displayName = "TeamBadge"

export { TeamBadge, teamBadgeVariants }
