import { render, screen } from "@testing-library/react"
import { HeroSection } from "../HeroSection"

describe("HeroSection", () => {
  const defaultProps = {
    title: "Welcome to Focipedia",
    subtitle: "Your ultimate football companion",
    ctaText: "Get Started",
  }

  it("renders the hero section with title and subtitle", () => {
    render(<HeroSection {...defaultProps} />)

    expect(screen.getByText("Welcome")).toBeInTheDocument()
    expect(screen.getByText("to Focipedia")).toBeInTheDocument()
    expect(
      screen.getByText("Your ultimate football companion")
    ).toBeInTheDocument()
  })

  it("renders CTA buttons", () => {
    render(<HeroSection {...defaultProps} />)

    expect(screen.getByText("Get Started")).toBeInTheDocument()
    expect(screen.getByText("Sign In")).toBeInTheDocument()
  })

  it("renders scroll down indicator", () => {
    render(<HeroSection {...defaultProps} />)

    expect(screen.getByText("Discover More")).toBeInTheDocument()
  })
})
