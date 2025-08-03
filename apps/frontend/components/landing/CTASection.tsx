"use client"

import { useState } from "react"
import { useIntersectionObserver } from "@/lib/animations"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Star, Users, Zap } from "lucide-react"

export function CTASection() {
  const { ref: sectionRef, hasIntersected: sectionIntersected } =
    useIntersectionObserver<HTMLElement>({
      threshold: 0.1,
    })

  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  const handleRegisterClick = () => {
    window.location.href = "/auth/register"
  }

  const handleLoginClick = () => {
    window.location.href = "/auth/login"
  }

  const socialProofItems = [
    { icon: <Users className="w-4 h-4" />, text: "50K+ Active Users" },
    { icon: <Star className="w-4 h-4" />, text: "4.9/5 Rating" },
    { icon: <Zap className="w-4 h-4" />, text: "Real-time Updates" },
  ]

  const benefits = [
    "Access to all premium features",
    "Real-time match notifications",
    "Advanced team analytics",
    "Personalized dashboard",
    "Community discussions",
    "Mobile app access",
  ]

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-football-green/10 via-background to-football-blue/10 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-football-green/10 to-football-blue/10" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <Card
            className={`bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl transition-all duration-700 ${
              sectionIntersected
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-12 scale-95"
            }`}
          >
            <CardContent className="p-8 sm:p-12 text-center">
              {/* Badge */}
              <div className="mb-6">
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-football-green/20 to-football-blue/20 text-football-blue border-football-blue/30 px-4 py-2 text-sm font-medium"
                >
                  🚀 Join the Community
                </Badge>
              </div>

              {/* Main Heading */}
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 transition-all duration-700 delay-200 ${
                  sectionIntersected
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Ready to Transform Your
                <span className="block text-gradient bg-gradient-to-r from-football-green to-football-blue bg-clip-text text-transparent">
                  Football Experience?
                </span>
              </h2>

              {/* Subtitle */}
              <p
                className={`text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${
                  sectionIntersected
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Join thousands of football fans who have already discovered the
                ultimate platform for tracking, analyzing, and enjoying the
                beautiful game.
              </p>

              {/* Benefits List */}
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-2xl mx-auto transition-all duration-700 delay-400 ${
                  sectionIntersected
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-muted-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-football-green mr-2 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 transition-all duration-700 delay-500 ${
                  sectionIntersected
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <Button
                  onClick={handleRegisterClick}
                  size="lg"
                  className="bg-gradient-to-r from-football-green to-football-blue hover:from-football-green/90 hover:to-football-blue/90 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px] relative overflow-hidden"
                  onMouseEnter={() => setHoveredButton("register")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <span className="relative z-10">Get Started Free</span>
                  {hoveredButton === "register" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                  )}
                </Button>

                <Button
                  onClick={handleLoginClick}
                  variant="outline"
                  size="lg"
                  className="border-2 border-football-blue/30 text-football-blue hover:bg-football-blue/10 hover:border-football-blue/50 font-semibold px-8 py-4 text-lg rounded-full backdrop-blur-sm transition-all duration-300 min-w-[200px]"
                  onMouseEnter={() => setHoveredButton("login")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  Sign In
                </Button>
              </div>

              {/* Social Proof */}
              <div
                className={`flex flex-wrap justify-center gap-6 text-sm text-muted-foreground transition-all duration-700 delay-600 ${
                  sectionIntersected
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                {socialProofItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 hover:text-football-blue transition-colors duration-300"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bottom Trust Indicators */}
          <div
            className={`text-center mt-8 transition-all duration-700 delay-700 ${
              sectionIntersected
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by football fans worldwide
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <div className="text-sm">4.9/5 from 10K+ reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated football icons */}
        <div className="absolute top-1/4 left-1/6 text-football-green/20 text-4xl animate-bounce delay-1000">
          ⚽
        </div>
        <div className="absolute top-1/3 right-1/6 text-football-blue/20 text-3xl animate-bounce delay-2000">
          🏆
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-football-orange/20 text-5xl animate-bounce delay-3000">
          ⚽
        </div>

        {/* Background gradients */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-football-green/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-football-blue/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </section>
  )
}
