import React from "react"
import { render, screen } from "@testing-library/react"
import { MatchCard } from "../MatchCard"
import { mockMatches } from "@/lib/mock-data"

const finishedMatch = mockMatches[0] // Manchester United vs Liverpool (finished)
const scheduledMatch = mockMatches[2] // Chelsea vs Manchester United (scheduled)
const liveMatch = { ...mockMatches[1], status: "live" as const } // Manchester City vs Arsenal (live)

describe("MatchCard", () => {
  it("renders finished match with score", () => {
    render(<MatchCard match={finishedMatch} />)

    // Should show team names/badges
    expect(screen.getByText("MUN")).toBeInTheDocument()
    expect(screen.getByText("LIV")).toBeInTheDocument()

    // Should show score
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()

    // Should show league badge
    expect(screen.getByText("Premier League")).toBeInTheDocument()
  })

  it("renders scheduled match with VS instead of score", () => {
    render(<MatchCard match={scheduledMatch} />)

    // Should show team names/badges
    expect(screen.getByText("CHE")).toBeInTheDocument()
    expect(screen.getByText("MUN")).toBeInTheDocument()

    // Should show VS instead of score
    expect(screen.getByText("VS")).toBeInTheDocument()

    // Should not show actual score
    expect(screen.queryByText("2")).not.toBeInTheDocument()
  })

  it("renders live match with live indicator", () => {
    render(<MatchCard match={liveMatch} />)

    // Should show LIVE badge
    expect(screen.getByText("LIVE")).toBeInTheDocument()

    // Should show score
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("renders compact variant correctly", () => {
    render(<MatchCard match={finishedMatch} variant="compact" />)

    // Should show team short names
    expect(screen.getByText("MUN")).toBeInTheDocument()
    expect(screen.getByText("LIV")).toBeInTheDocument()

    // Should not show full team names in compact mode
    expect(screen.queryByText("Manchester United")).not.toBeInTheDocument()
    expect(screen.queryByText("Liverpool")).not.toBeInTheDocument()
  })

  it("renders detailed variant with team names", () => {
    render(<MatchCard match={finishedMatch} variant="detailed" />)

    // Should show full team names in detailed mode
    expect(screen.getByText("Manchester United")).toBeInTheDocument()
    expect(screen.getByText("Liverpool")).toBeInTheDocument()
  })

  it("shows date when showDate is true", () => {
    render(<MatchCard match={finishedMatch} showDate />)

    // Should show formatted date
    const dateElement = screen.getByText(/Aug 10/)
    expect(dateElement).toBeInTheDocument()
  })

  it("shows venue when showVenue is true", () => {
    render(<MatchCard match={finishedMatch} showVenue />)

    // Should show venue
    expect(screen.getByText("Old Trafford")).toBeInTheDocument()
  })

  it("hides date when showDate is false", () => {
    render(<MatchCard match={finishedMatch} showDate={false} />)

    // Should not show date
    expect(screen.queryByText(/Aug 10/)).not.toBeInTheDocument()
  })

  it("applies correct status styling", () => {
    const { rerender } = render(<MatchCard match={finishedMatch} />)

    // Test finished match styling
    let card =
      screen.getByRole("button") ||
      screen.getByText("2").closest("[class*='border']")
    expect(card).toHaveClass(/border-gray/)

    // Test scheduled match styling
    rerender(<MatchCard match={scheduledMatch} />)
    card = screen.getByText("VS").closest("[class*='border']")
    expect(card).toHaveClass(/border-blue/)

    // Test live match styling
    rerender(<MatchCard match={liveMatch} />)
    card = screen.getByText("LIVE").closest("[class*='border']")
    expect(card).toHaveClass(/border-red/)
  })

  it("handles match without venue gracefully", () => {
    const matchWithoutVenue = { ...finishedMatch, venue: undefined }
    render(<MatchCard match={matchWithoutVenue} showVenue />)

    // Should still render without crashing
    expect(screen.getByText("MUN")).toBeInTheDocument()
    expect(screen.queryByText("Old Trafford")).not.toBeInTheDocument()
  })

  it("handles match without score gracefully", () => {
    const matchWithoutScore = { ...finishedMatch, score: null }
    render(<MatchCard match={matchWithoutScore} />)

    // Should show VS instead of score
    expect(screen.getByText("VS")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(<MatchCard match={finishedMatch} className="custom-class" />)

    const card = screen.getByText("2").closest("div")
    expect(card).toHaveClass("custom-class")
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<MatchCard match={finishedMatch} ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("formats different match statuses correctly", () => {
    // Test scheduled match date formatting
    render(<MatchCard match={scheduledMatch} showDate />)
    expect(screen.getByText(/Aug 15/)).toBeInTheDocument()

    // Test live match
    const { rerender } = render(<MatchCard match={liveMatch} showDate />)
    expect(screen.getByText("LIVE")).toBeInTheDocument()
  })
})
