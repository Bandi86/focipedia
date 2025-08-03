"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useIntersectionObserver } from "@/lib/animations"
import { ChevronDown } from "lucide-react"

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText: string
  backgroundImage?: string
}

export function HeroSection({
  title,
  subtitle,
  ctaText,
  backgroundImage = "/hero-bg.jpg",
}: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const { ref, hasIntersected } = useIntersectionObserver<HTMLElement>()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleScrollDown = () => {
    const nextSection = document.querySelector("#features")
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleCTAClick = () => {
    // Navigate to registration or dashboard
    window.location.href = "/auth/register"
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-football-green/90 via-football-blue/80 to-football-dark/90" />
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div
          className={`transition-all duration-1000 ${
            isLoaded && hasIntersected
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block">{title.split(" ")[0]}</span>
            <span className="block text-gradient bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {title.split(" ").slice(1).join(" ")}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${
              isLoaded && hasIntersected
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${
              isLoaded && hasIntersected
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
            >
              {ctaText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-8 py-4 text-lg rounded-full backdrop-blur-sm transition-all duration-300 min-w-[200px]"
              onClick={() => (window.location.href = "/auth/login")}
            >
              Sign In
            </Button>
          </div>

          {/* Social Proof */}
          <div
            className={`mt-12 text-white/70 transition-all duration-1000 delay-700 ${
              isLoaded && hasIntersected
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-sm sm:text-base mb-4">
              Trusted by over 50,000 football fans worldwide
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-xs sm:text-sm">⭐⭐⭐⭐⭐</div>
              <div className="text-xs sm:text-sm">4.9/5 Rating</div>
              <div className="text-xs sm:text-sm">1M+ Matches Tracked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
          isLoaded && hasIntersected
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors duration-300 group"
          aria-label="Scroll to next section"
        >
          <span className="text-sm mb-2 hidden sm:block">Discover More</span>
          <ChevronDown className="w-6 h-6 animate-bounce group-hover:animate-none group-hover:transform group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Football Icons */}
        <div className="absolute top-1/4 left-1/4 text-white/10 text-6xl animate-bounce delay-1000">
          ⚽
        </div>
        <div className="absolute top-1/3 right-1/4 text-white/10 text-4xl animate-bounce delay-2000">
          🏆
        </div>
        <div className="absolute bottom-1/4 left-1/6 text-white/10 text-5xl animate-bounce delay-3000">
          ⚽
        </div>
      </div>
    </section>
  )
}
