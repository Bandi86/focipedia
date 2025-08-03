import React from "react"
import { render, screen } from "@testing-library/react"
import { TeamBadge } from "../TeamBadge"
import { mockTeams } from "@/lib/mock-data"

const mockTeam = mockTeams[0] // Manchester United

describe("TeamBadge", () => {
  it("renders team logo with fallback", () => {
    render(<TeamBadge team={mockTeam} />)

    const avatar = screen.getByRole("img", { name: `${mockTeam.name} logo` })
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute("src", mockTeam.logo)
    expect(avatar).toHaveAttribute("alt", `${mockTeam.name} logo`)
  })

  it("renders fallback when logo fails to load", () => {
    const teamWithoutLogo = { ...mockTeam, logo: "" }
    render(<TeamBadge team={teamWithoutLogo} />)

    // Should show fallback with team short name
    expect(screen.getByText("MU")).toBeInTheDocument() // First 2 chars of "MUN"
  })

  it("renders with different sizes", () => {
    const { rerender } = render(<TeamBadge team={mockTeam} size="sm" />)
    expect(screen.getByRole("img")).toBeInTheDocument()

    rerender(<TeamBadge team={mockTeam} size="md" />)
    expect(screen.getByRole("img")).toBeInTheDocument()

    rerender(<TeamBadge team={mockTeam} size="lg" />)
    expect(screen.getByRole("img")).toBeInTheDocument()
  })

  it("shows team name when showName is true", () => {
    render(<TeamBadge team={mockTeam} showName />)

    expect(screen.getByText(mockTeam.name)).toBeInTheDocument()
  })

  it("shows short name when showShortName is true", () => {
    render(<TeamBadge team={mockTeam} showShortName />)

    expect(screen.getByText(mockTeam.shortName)).toBeInTheDocument()
  })

  it("shows both name and short name when both props are true", () => {
    render(<TeamBadge team={mockTeam} showName showShortName />)

    expect(screen.getByText(mockTeam.name)).toBeInTheDocument()
    expect(screen.getByText(mockTeam.shortName)).toBeInTheDocument()
  })

  it("applies team colors as CSS custom properties", () => {
    render(<TeamBadge team={mockTeam} />)

    const badge = screen.getByRole("img").closest("div")?.parentElement
    expect(badge).toHaveStyle({
      "--team-primary": mockTeam.colors.primary,
      "--team-secondary": mockTeam.colors.secondary,
    })
  })

  it("renders with different variants", () => {
    const { rerender } = render(<TeamBadge team={mockTeam} variant="default" />)
    expect(screen.getByRole("img")).toBeInTheDocument()

    rerender(<TeamBadge team={mockTeam} variant="compact" />)
    expect(screen.getByRole("img")).toBeInTheDocument()

    rerender(<TeamBadge team={mockTeam} variant="detailed" />)
    expect(screen.getByRole("img")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(<TeamBadge team={mockTeam} className="custom-class" />)

    const badge = screen.getByRole("img").closest("div")?.parentElement
    expect(badge).toHaveClass("custom-class")
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<TeamBadge team={mockTeam} ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("handles missing team data gracefully", () => {
    const incompleteTeam = {
      ...mockTeam,
      logo: "",
      name: "",
      shortName: "",
    }

    render(<TeamBadge team={incompleteTeam} showName showShortName />)

    // Should still render without crashing
    expect(screen.getByRole("img")).toBeInTheDocument()
  })
})
