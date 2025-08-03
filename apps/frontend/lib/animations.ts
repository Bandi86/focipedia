// Animation utilities and hooks for football-themed interactions

import { useEffect, useRef, useState } from "react"

// Intersection Observer hook for scroll-triggered animations
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [hasIntersected, options])

  return { ref, isIntersecting, hasIntersected }
}

// Counter animation hook for statistics
export function useCounterAnimation(
  end: number,
  duration: number = 2000,
  start: number = 0
) {
  const [count, setCount] = useState(start)
  const [isAnimating, setIsAnimating] = useState(false)

  const startAnimation = () => {
    if (isAnimating) return

    setIsAnimating(true)
    const startTime = Date.now()
    const startValue = start

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(startValue + (end - startValue) * easeOut)

      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }

  return { count, startAnimation, isAnimating }
}

// Staggered animation utilities
export function getStaggerDelay(
  index: number,
  baseDelay: number = 100
): number {
  return index * baseDelay
}

export function createStaggeredAnimation(
  elements: NodeListOf<Element> | Element[],
  animationClass: string,
  staggerDelay: number = 100
) {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(animationClass)
    }, index * staggerDelay)
  })
}

// Smooth scroll utility
export function smoothScrollTo(
  element: HTMLElement | string,
  options: ScrollIntoViewOptions = {}
) {
  const target =
    typeof element === "string"
      ? (document.querySelector(element) as HTMLElement)
      : element

  if (!target) return

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
    ...options,
  })
}

// Animation presets for common football UI elements
export const animationPresets = {
  // Card hover effects
  cardHover:
    "transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25",

  // Button animations
  buttonPress: "transition-transform duration-150 active:scale-95",
  buttonHover: "transition-colors duration-200 hover:opacity-90",

  // Fade in animations
  fadeIn: "animate-fade-in",
  slideInLeft: "animate-slide-in-left",
  slideInRight: "animate-slide-in-right",
  scaleIn: "animate-scale-in",

  // Loading animations
  pulse: "animate-pulse",
  spin: "animate-spin",
  bounce: "animate-bounce",

  // Football-specific animations
  ballBounce: "animate-bounce",
  scoreCounter: "animate-counter",
  teamColorPulse: "animate-pulse",
}

// CSS-in-JS animation styles for dynamic use
export const animationStyles = {
  fadeIn: {
    animation: "fade-in 0.5s ease-out",
  },
  slideInLeft: {
    animation: "slide-in-left 0.5s ease-out",
  },
  slideInRight: {
    animation: "slide-in-right 0.5s ease-out",
  },
  scaleIn: {
    animation: "scale-in 0.3s ease-out",
  },
  counterUp: {
    animation: "counter 2s ease-out",
  },
}

// Utility to check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// Animation wrapper that respects user preferences
export function createAccessibleAnimation(
  animationClass: string,
  fallbackClass: string = ""
): string {
  if (prefersReducedMotion()) {
    return fallbackClass
  }
  return animationClass
}

// Performance-optimized animation frame utility
export function useAnimationFrame(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number | undefined>(undefined)

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [callback])
}

// Debounced animation trigger
export function useDebounceAnimation(
  callback: () => void,
  delay: number = 300
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const trigger = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(callback, delay)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return trigger
}
