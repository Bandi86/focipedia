import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { StatCard } from "../StatCard"

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

describe("StatCard", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders stat information correctly", () => {
    render(<StatCard value="1,234" label="Total Users" />)

    // Should show value and label
    expect(screen.getByText("1,234")).toBeInTheDocument()
    expect(screen.getByText("Total Users")).toBeInTheDocument()
  })

  it("renders with icon", () => {
    const TestIcon = () => <span data-testid="test-icon">⚽</span>
    render(<StatCard value="50" label="Goals" icon={<TestIcon />} />)

    // Should show icon
    expect(screen.getByTestId("test-icon")).toBeInTheDocument()
    expect(screen.getByText("⚽")).toBeInTheDocument()
  })

  it("renders with description", () => {
    render(<StatCard value="100" label="Matches" description="This season" />)

    // Should show description
    expect(screen.getByText("This season")).toBeInTheDocument()
  })

  it("renders trend information", () => {
    render(<StatCard value="75" label="Win Rate" trend="up" trendValue="+5%" />)

    // Should show trend indicator and value
    expect(screen.getByText("↗")).toBeInTheDocument()
    expect(screen.getByText("+5%")).toBeInTheDocument()
  })

  it("renders different trend types", () => {
    const { rerender } = render(
      <StatCard value="50" label="Test" trend="up" trendValue="+10%" />
    )
    expect(screen.getByText("↗")).toBeInTheDocument()

    rerender(<StatCard value="50" label="Test" trend="down" trendValue="-5%" />)
    expect(screen.getByText("↘")).toBeInTheDocument()

    rerender(
      <StatCard value="50" label="Test" trend="neutral" trendValue="0%" />
    )
    expect(screen.getByText("→")).toBeInTheDocument()
  })

  it("renders different variants", () => {
    const { rerender } = render(
      <StatCard value="100" label="Test" variant="default" />
    )
    expect(screen.getByText("100")).toBeInTheDocument()

    rerender(<StatCard value="100" label="Test" variant="gradient" />)
    expect(screen.getByText("100")).toBeInTheDocument()

    rerender(<StatCard value="100" label="Test" variant="minimal" />)
    expect(screen.getByText("100")).toBeInTheDocument()

    rerender(<StatCard value="100" label="Test" variant="featured" />)
    expect(screen.getByText("100")).toBeInTheDocument()
  })

  it("renders different sizes", () => {
    const { rerender } = render(<StatCard value="100" label="Test" size="sm" />)
    expect(screen.getByText("100")).toBeInTheDocument()

    rerender(<StatCard value="100" label="Test" size="md" />)
    expect(screen.getByText("100")).toBeInTheDocument()

    rerender(<StatCard value="100" label="Test" size="lg" />)
    expect(screen.getByText("100")).toBeInTheDocument()
  })

  it("handles string values without animation", () => {
    render(<StatCard value="N/A" label="Test" animated />)

    // Should show string value immediately
    expect(screen.getByText("N/A")).toBeInTheDocument()
  })

  it("handles numeric values with animation disabled", () => {
    render(<StatCard value={1000} label="Test" animated={false} />)

    // Should show final value immediately
    expect(screen.getByText("1,000")).toBeInTheDocument()
  })

  it("applies different value colors", () => {
    const { rerender } = render(
      <StatCard value="100" label="Test" valueColor="green" />
    )
    const valueElement = screen.getByText("100")
    expect(valueElement).toHaveClass("text-football-green")

    rerender(<StatCard value="100" label="Test" valueColor="blue" />)
    expect(screen.getByText("100")).toHaveClass("text-football-blue")

    rerender(<StatCard value="100" label="Test" valueColor="orange" />)
    expect(screen.getByText("100")).toHaveClass("text-football-orange")

    rerender(<StatCard value="100" label="Test" valueColor="gradient" />)
    expect(screen.getByText("100")).toHaveClass("bg-gradient-to-r")
  })

  it("applies custom className", () => {
    render(<StatCard value="100" label="Test" className="custom-class" />)

    const card = screen.getByText("100").closest("div")
    expect(card).toHaveClass("custom-class")
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<StatCard value="100" label="Test" ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("handles missing trend value gracefully", () => {
    render(<StatCard value="100" label="Test" trend="up" />)

    // Should not show trend without trendValue
    expect(screen.queryByText("↗")).not.toBeInTheDocument()
  })

  it("formats numeric values with commas", () => {
    render(<StatCard value={1234567} label="Test" animated={false} />)

    // Should format large numbers with commas
    expect(screen.getByText("1,234,567")).toBeInTheDocument()
  })
})
