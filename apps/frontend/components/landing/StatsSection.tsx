"use client"

import { useEffect, useState } from "react"
import {
  useIntersectionObserver,
  useCounterAnimation,
  getStaggerDelay,
} from "@/lib/animations"
import { Badge } from "@/components/ui/badge"

interface Stat {
  value: string
  label: string
  icon?: React.ReactNode
}

interface StatsSectionProps {
  stats: Stat[]
  title: string
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.3,
  })

  // Extract numeric value for counter animation
  const numericValue = parseInt(stat.value.replace(/[^\d]/g, "")) || 0
  const { count, startAnimation } = useCounterAnimation(numericValue, 2000)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasIntersected && !hasAnimated) {
      startAnimation()
      setHasAnimated(true)
    }
  }, [hasIntersected, hasAnimated, startAnimation])

  const delay = getStaggerDelay(index, 200)

  // Format the counter value back to original format
  const formatValue = (value: number): string => {
    const originalValue = stat.value
    if (originalValue.includes("K")) {
      return `${(value / 1000).toFixed(value >= 1000 ? 0 : 1)}K+`
    }
    if (originalValue.includes("M")) {
      return `${(value / 1000000).toFixed(value >= 1000000 ? 1 : 2)}M+`
    }
    if (originalValue.includes("+")) {
      return `${value}+`
    }
    return value.toString()
  }

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ease-out ${
        hasIntersected
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Icon */}
      {stat.icon && (
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-football-green/20 to-football-blue/20 flex items-center justify-center text-3xl hover:scale-110 transition-transform duration-300">
            {stat.icon}
          </div>
        </div>
      )}

      {/* Animated Counter */}
      <div className="mb-2">
        <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient bg-gradient-to-r from-football-green to-football-blue bg-clip-text text-transparent">
          {hasAnimated ? formatValue(count) : "0"}
        </span>
      </div>

      {/* Label */}
      <p className="text-lg font-medium text-muted-foreground">{stat.label}</p>

      {/* Animated underline */}
      <div
        className={`mx-auto mt-3 h-1 bg-gradient-to-r from-football-green to-football-blue rounded-full transition-all duration-1000 ${
          hasIntersected ? "w-12" : "w-0"
        }`}
        style={{ transitionDelay: `${delay + 500}ms` }}
      />
    </div>
  )
}

export function StatsSection({ stats, title }: StatsSectionProps) {
  const { ref: sectionRef, hasIntersected: sectionIntersected } =
    useIntersectionObserver<HTMLElement>({
      threshold: 0.1,
    })

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-football-blue/5 to-football-green/5" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div
            className={`transition-all duration-700 ${
              sectionIntersected
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <Badge
              variant="secondary"
              className="mb-4 text-sm font-medium bg-football-blue/10 text-football-blue border-football-blue/20"
            >
              Our Impact
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join thousands of football enthusiasts who trust our platform for
              the most comprehensive football experience.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Achievement Badges */}
        <div
          className={`flex flex-wrap justify-center gap-4 mt-12 lg:mt-16 transition-all duration-700 delay-1000 ${
            sectionIntersected
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <Badge
            variant="outline"
            className="px-4 py-2 text-sm border-football-green/30 text-football-green hover:bg-football-green/10 transition-colors duration-300"
          >
            🏆 #1 Football Platform
          </Badge>
          <Badge
            variant="outline"
            className="px-4 py-2 text-sm border-football-blue/30 text-football-blue hover:bg-football-blue/10 transition-colors duration-300"
          >
            ⭐ 4.9/5 User Rating
          </Badge>
          <Badge
            variant="outline"
            className="px-4 py-2 text-sm border-football-orange/30 text-football-orange hover:bg-football-orange/10 transition-colors duration-300"
          >
            🚀 Growing Fast
          </Badge>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated circles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-football-green rounded-full animate-ping" />
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-football-blue rounded-full animate-ping delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-football-orange rounded-full animate-ping delay-2000" />

        {/* Large background shapes */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-football-green/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-football-blue/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </section>
  )
}
