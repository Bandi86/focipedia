import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TeamBadge } from "./TeamBadge"
import { type Match } from "@/lib/mock-data"
// Using native Date methods for formatting

const matchCardVariants = cva(
  "transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer",
  {
    variants: {
      variant: {
        compact: "p-3",
        detailed: "p-4",
      },
      status: {
        scheduled: "border-blue-200 hover:border-blue-300",
        live: "border-red-200 hover:border-red-300 ring-2 ring-red-100",
        finished: "border-gray-200 hover:border-gray-300",
      },
    },
    defaultVariants: {
      variant: "compact",
      status: "finished",
    },
  }
)

const scoreVariants = cva(
  "font-bold text-center transition-colors duration-200",
  {
    variants: {
      size: {
        compact: "text-lg",
        detailed: "text-2xl",
      },
      status: {
        scheduled: "text-muted-foreground",
        live: "text-red-600 animate-pulse",
        finished: "text-foreground",
      },
    },
    defaultVariants: {
      size: "compact",
      status: "finished",
    },
  }
)

export interface MatchCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof matchCardVariants> {
  match: Match
  showDate?: boolean
  showVenue?: boolean
}

const MatchCard = React.forwardRef<HTMLDivElement, MatchCardProps>(
  (
    {
      className,
      match,
      variant = "compact",
      showDate = true,
      showVenue = false,
      ...props
    },
    ref
  ) => {
    const isCompact = variant === "compact"
    const teamBadgeSize = isCompact ? "sm" : "md"

    const formatMatchDate = (date: Date) => {
      if (match.status === "live") {
        return "LIVE"
      }

      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
      }

      if (match.status === "scheduled") {
        options.hour = "2-digit"
        options.minute = "2-digit"
      }

      return date.toLocaleDateString("en-US", options)
    }

    const getStatusBadgeVariant = () => {
      switch (match.status) {
        case "live":
          return "live"
        case "finished":
          return "finished"
        case "scheduled":
          return "scheduled"
        default:
          return "scheduled"
      }
    }

    const renderScore = () => {
      if (match.status === "scheduled" || !match.score) {
        return (
          <div
            className={cn(
              scoreVariants({
                size: isCompact ? "compact" : "detailed",
                status: "scheduled",
              })
            )}
          >
            VS
          </div>
        )
      }

      return (
        <div className="flex items-center gap-1">
          <span
            className={cn(
              scoreVariants({
                size: isCompact ? "compact" : "detailed",
                status: match.status,
              })
            )}
          >
            {match.score.home}
          </span>
          <span className="text-muted-foreground">-</span>
          <span
            className={cn(
              scoreVariants({
                size: isCompact ? "compact" : "detailed",
                status: match.status,
              })
            )}
          >
            {match.score.away}
          </span>
        </div>
      )
    }

    return (
      <Card
        ref={ref}
        className={cn(
          matchCardVariants({ variant, status: match.status }),
          className
        )}
        {...props}
      >
        <CardContent className={isCompact ? "p-3" : "p-4"}>
          <div className="flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className="flex items-center gap-2 flex-1">
              <TeamBadge
                team={match.homeTeam}
                size={teamBadgeSize}
                showShortName={!isCompact}
                variant={isCompact ? "compact" : "default"}
              />
              {!isCompact && (
                <span className="font-medium text-sm truncate">
                  {match.homeTeam.name}
                </span>
              )}
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-1">
              {renderScore()}
              {match.status === "live" && (
                <Badge variant="live" size="sm">
                  LIVE
                </Badge>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              {!isCompact && (
                <span className="font-medium text-sm truncate">
                  {match.awayTeam.name}
                </span>
              )}
              <TeamBadge
                team={match.awayTeam}
                size={teamBadgeSize}
                showShortName={!isCompact}
                variant={isCompact ? "compact" : "default"}
              />
            </div>
          </div>

          {/* Additional Info */}
          {(showDate || showVenue || !isCompact) && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2">
                {showDate && (
                  <span className="text-xs text-muted-foreground">
                    {formatMatchDate(match.date)}
                  </span>
                )}
                {showVenue && match.venue && (
                  <>
                    {showDate && (
                      <span className="text-xs text-muted-foreground">•</span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {match.venue}
                    </span>
                  </>
                )}
              </div>

              <Badge variant="league" size="sm" className="text-xs">
                {match.league.name}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)

MatchCard.displayName = "MatchCard"

export { MatchCard, matchCardVariants }
