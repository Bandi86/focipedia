import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { type League } from "@/lib/mock-data"

const leagueCardVariants = cva(
  "transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer group",
  {
    variants: {
      variant: {
        default: "border hover:border-football-green/30",
        featured:
          "border-2 border-football-green/20 hover:border-football-green/40 bg-gradient-to-br from-football-light/50 to-white",
        compact: "p-3 hover:bg-football-light/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface LeagueCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof leagueCardVariants> {
  league: League
  showTeamCount?: boolean
  showCountry?: boolean
  showSeason?: boolean
}

const LeagueCard = React.forwardRef<HTMLDivElement, LeagueCardProps>(
  (
    {
      className,
      league,
      variant = "default",
      showTeamCount = true,
      showCountry = true,
      showSeason = true,
      ...props
    },
    ref
  ) => {
    const isCompact = variant === "compact"

    return (
      <Card
        ref={ref}
        className={cn(leagueCardVariants({ variant }), className)}
        {...props}
      >
        {!isCompact && (
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar size="lg" variant="football">
                <AvatarImage
                  src={league.logo}
                  alt={`${league.name} logo`}
                  className="object-contain p-2"
                />
                <AvatarFallback className="bg-gradient-to-br from-football-green to-football-blue text-white font-bold text-lg">
                  {league.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground group-hover:text-football-green transition-colors duration-200">
                  {league.name}
                </h3>
                {showCountry && (
                  <p className="text-sm text-muted-foreground">
                    {league.country}
                  </p>
                )}
              </div>

              {showSeason && (
                <Badge variant="football" size="sm">
                  {league.season}
                </Badge>
              )}
            </div>
          </CardHeader>
        )}

        <CardContent className={isCompact ? "p-3" : "pt-0"}>
          {isCompact && (
            <div className="flex items-center gap-3 mb-3">
              <Avatar size="default" variant="football">
                <AvatarImage
                  src={league.logo}
                  alt={`${league.name} logo`}
                  className="object-contain p-1"
                />
                <AvatarFallback className="bg-gradient-to-br from-football-green to-football-blue text-white font-bold">
                  {league.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h4 className="font-semibold text-foreground group-hover:text-football-green transition-colors duration-200">
                  {league.name}
                </h4>
                {showCountry && (
                  <p className="text-xs text-muted-foreground">
                    {league.country}
                  </p>
                )}
              </div>

              {showSeason && (
                <Badge variant="football" size="sm">
                  {league.season}
                </Badge>
              )}
            </div>
          )}

          {showTeamCount && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-football-green rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">
                  Teams
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-football-green group-hover:scale-110 transition-transform duration-200">
                  {league.teams.length}
                </span>
                <span className="text-sm text-muted-foreground">clubs</span>
              </div>
            </div>
          )}

          {!isCompact && league.teams.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Featured Teams
                </span>
              </div>
              <div className="flex -space-x-2 overflow-hidden">
                {league.teams.slice(0, 5).map((team) => (
                  <Avatar
                    key={team.id}
                    size="sm"
                    variant="team"
                    className="border-2 border-white hover:z-10 hover:scale-110 transition-all duration-200"
                    title={team.name}
                  >
                    <AvatarImage
                      src={team.logo}
                      alt={`${team.name} logo`}
                      className="object-contain p-0.5"
                    />
                    <AvatarFallback
                      className="text-white text-xs font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${team.colors.primary}, ${team.colors.secondary})`,
                      }}
                    >
                      {team.shortName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {league.teams.length > 5 && (
                  <div className="flex items-center justify-center w-8 h-8 bg-muted border-2 border-white rounded-full text-xs font-medium text-muted-foreground">
                    +{league.teams.length - 5}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)

LeagueCard.displayName = "LeagueCard"

export { LeagueCard, leagueCardVariants }
