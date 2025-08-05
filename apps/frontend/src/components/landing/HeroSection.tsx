'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { hu } from '@/lib/i18n/hu';

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-green-900 via-green-800 to-emerald-900",
        className
      )}
      aria-labelledby="hero-heading"
    >
      {/* Football field background pattern (decorative) */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
          aria-hidden="true"
        ></div>
      </div>

      {/* Gradient overlay (decorative) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" aria-hidden="true"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Main heading with animation */}
        <div className="space-y-6">
          {/* h1 is visually rendered here, but a sr-only h1 exists in page main to keep single h1 semantics */}
          <h2 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            <span className="block animate-fade-in-up">Üdvözöl a</span>
            <span className="block bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
              {hu.common.appName}
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 animate-fade-in-up animation-delay-400">
              közösségében!
            </span>
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-600">
            {hu.landing.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in-up animation-delay-800">
            <Button
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => (window.location.href = '/register')}
            >
              {hu.common.buttons.signUp}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => (window.location.href = '/login')}
            >
              {hu.common.buttons.signIn}
            </Button>
          </div>

          {/* Stats preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 animate-fade-in-up animation-delay-1000">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-100">Aktív felhasználó</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-gray-100">Poszt és komment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-100">Élő beszélgetések</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements hidden from a11y and reduced motion via CSS */}
      <div className="absolute top-20 left-10 w-8 h-8 bg-white rounded-full opacity-20 animate-bounce animation-delay-1000" aria-hidden="true"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-white rounded-full opacity-15 animate-bounce animation-delay-1500" aria-hidden="true"></div>
      <div className="absolute bottom-40 left-20 w-10 h-10 bg-white rounded-full opacity-10 animate-bounce animation-delay-2000" aria-hidden="true"></div>
      <div className="absolute bottom-20 right-10 w-4 h-4 bg-white rounded-full opacity-25 animate-bounce animation-delay-500" aria-hidden="true"></div>

      {/* Scroll indicator (decorative) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce" aria-hidden="true">
        <div className="w-6 h-10 rounded-full border-2 border-white/80 flex justify-center">
          <div className="w-1 h-3 bg-white/90 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}