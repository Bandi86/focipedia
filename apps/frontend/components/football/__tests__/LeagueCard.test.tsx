import React from "react"
import { render, screen } from "@testing-library/react"
import { LeagueCard } from "../LeagueCard"
import { mockLeagues } from "@/lib/mock-data"

const mockLeague = mockLeagues[0] // Premier League

describe("LeagueCard", () => {
  it("renders league information correctly", () => {
    render(<LeagueCard league={mockLeague} />)

    // Should show league name
    expect(screen.getByText(mockLeague.name)).toBeInTheDocument()

    // Should show country
    expect(screen.getByText(mockLeague.country)).toBeInTheDocument()

    // Should show season
    expect(screen.getByText(mockLeague.season)).toBeInTheDocument()

    // Should show team count
    expect(
      screen.getByText(mockLeague.teams.length.toString())
    ).toBeInTheDocument()
    expect(screen.getByText("clubs")).toBeInTheDocument()
  })

  it("renders league logo with fallback", () => {
    render(<LeagueCard league={mockLeague} />)

    const logo = screen.getByRole("img", { name: `${mockLeague.name} logo` })
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute("src", mockLeague.logo)
    expect(logo).toHaveAttribute("alt", `${mockLeague.name} logo`)
  })

  it("renders fallback when logo fails to load", () => {
    const leagueWithoutLogo = { ...mockLeague, logo: "" }
    render(<LeagueCard league={leagueWithoutLogo} />)

    // Should show fallback with league initials
    expect(screen.getByText("PL")).toBeInTheDocument() // Premier League -> PL
  })

  it("shows/hides team count based on prop", () => {
    const { rerender } = render(
      <LeagueCard league={mockLeague} showTeamCount />
    )

    // Should show team count
    expect(screen.getByText("Teams")).toBeInTheDocument()
    expect(
      screen.getByText(mockLeague.teams.length.toString())
    ).toBeInTheDocument()

    rerender(<LeagueCard league={mockLeague} showTeamCount={false} />)

    // Should not show team count
    expect(screen.queryByText("Teams")).not.toBeInTheDocument()
  })

  it("shows/hides country based on prop", () => {
    const { rerender } = render(<LeagueCard league={mockLeague} showCountry />)

    // Should show country
    expect(screen.getByText(mockLeague.country)).toBeInTheDocument()

    rerender(<LeagueCard league={mockLeague} showCountry={false} />)

    // Should not show country
    expect(screen.queryByText(mockLeague.country)).not.toBeInTheDocument()
  })

  it("shows/hides season based on prop", () => {
    const { rerender } = render(<LeagueCard league={mockLeague} showSeason />)

    // Should show season
    expect(screen.getByText(mockLeague.season)).toBeInTheDocument()

    rerender(<LeagueCard league={mockLeague} showSeason={false} />)

    // Should not show season
    expect(screen.queryByText(mockLeague.season)).not.toBeInTheDocument()
  })

  it("renders different variants correctly", () => {
    const { rerender } = render(
      <LeagueCard league={mockLeague} variant="default" />
    )
    expect(screen.getByText(mockLeague.name)).toBeInTheDocument()

    rerender(<LeagueCard league={mockLeague} variant="featured" />)
    expect(screen.getByText(mockLeague.name)).toBeInTheDocument()

    rerender(<LeagueCard league={mockLeague} variant="compact" />)
    expect(screen.getByText(mockLeague.name)).toBeInTheDocument()
  })

  it("renders featured teams in non-compact variant", () => {
    render(<LeagueCard league={mockLeague} variant="default" />)

    // Should show "Featured Teams" section
    expect(screen.getByText("Featured Teams")).toBeInTheDocument()

    // Should show team avatars (first 5 teams)
    const teamAvatars = screen.getAllByRole("img")
    expect(teamAvatars.length).toBeGreaterThan(1) // League logo + team logos
  })

  it("does not render featured teams in compact variant", () => {
    render(<LeagueCard league={mockLeague} variant="compact" />)

    // Should not show "Featured Teams" section
    expect(screen.queryByText("Featured Teams")).not.toBeInTheDocument()
  })

  it("handles league with no teams gracefully", () => {
    const emptyLeague = { ...mockLeague, teams: [] }
    render(<LeagueCard league={emptyLeague} />)

    // Should show 0 teams
    expect(screen.getByText("0")).toBeInTheDocument()
    expect(screen.getByText("clubs")).toBeInTheDocument()

    // Should not show featured teams section
    expect(screen.queryByText("Featured Teams")).not.toBeInTheDocument()
  })

  it("shows +N indicator when more than 5 teams", () => {
    const leagueWithManyTeams = {
      ...mockLeague,
      teams: [...mockLeague.teams, ...mockLeague.teams], // Duplicate to get more than 5
    }

    render(<LeagueCard league={leagueWithManyTeams} variant="default" />)

    // Should show +N indicator if more than 5 teams
    if (leagueWithManyTeams.teams.length > 5) {
      const plusIndicator = screen.getByText(
        `+${leagueWithManyTeams.teams.length - 5}`
      )
      expect(plusIndicator).toBeInTheDocument()
    }
  })

  it("applies custom className", () => {
    render(<LeagueCard league={mockLeague} className="custom-class" />)

    const card = screen.getByText(mockLeague.name).closest("div")
    expect(card).toHaveClass("custom-class")
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<LeagueCard league={mockLeague} ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
