"use client"

import { useIntersectionObserver, getStaggerDelay } from "@/lib/animations"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface FeaturesSectionProps {
  features: Feature[]
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const { ref, hasIntersected } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
  })

  const delay = getStaggerDelay(index, 150)

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        hasIntersected
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Card className="group h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-football-blue/30 transition-all duration-300 hover:shadow-lg hover:shadow-football-blue/10 hover:-translate-y-2">
        <CardContent className="p-6 text-center">
          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-football-green/20 to-football-blue/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-football-blue transition-colors duration-300">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>

          {/* Hover indicator */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Badge variant="secondary" className="text-xs">
              Learn More →
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  const { ref: sectionRef, hasIntersected: sectionIntersected } =
    useIntersectionObserver<HTMLElement>({
      threshold: 0.1,
    })

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
              className="mb-4 text-sm font-medium bg-football-green/10 text-football-green border-football-green/20"
            >
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Everything You Need for
              <span className="block text-gradient bg-gradient-to-r from-football-green to-football-blue bg-clip-text text-transparent">
                Football Excellence
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover powerful tools and insights that will transform how you
              experience and understand the beautiful game.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-12 lg:mt-16 transition-all duration-700 delay-500 ${
            sectionIntersected
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-muted-foreground mb-4">
            Ready to elevate your football experience?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-football-green to-football-blue text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-football-blue/25 transform hover:scale-105 transition-all duration-300">
              Get Started Free
            </button>
            <button className="text-football-blue hover:text-football-green font-medium transition-colors duration-300">
              View All Features →
            </button>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-0 w-32 h-32 bg-football-green/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-40 h-40 bg-football-blue/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-football-orange/5 rounded-full blur-2xl animate-pulse delay-2000" />
      </div>
    </section>
  )
}
