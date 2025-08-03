# Design Document

## Overview

This design document outlines the implementation of a modern, football-themed landing page and enhanced dashboard for the Focipedia application. The design leverages shadcn/ui components, modern CSS techniques, and football-inspired visual elements to create an engaging user experience. The implementation will transform the current minimal pages into rich, interactive interfaces while maintaining the existing authentication system and preparing for future social media features.

## Architecture

### Component Structure

```
apps/frontend/
├── components/
│   ├── ui/                    # shadcn/ui components (extended)
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   └── skeleton.tsx
│   ├── football/              # Football-specific components
│   │   ├── MatchCard.tsx
│   │   ├── TeamBadge.tsx
│   │   ├── LeagueCard.tsx
│   │   ├── StatCard.tsx
│   │   └── PlayerCard.tsx
│   ├── landing/               # Landing page components
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── StatsSection.tsx
│   │   └── CTASection.tsx
│   └── dashboard/             # Dashboard components
│       ├── DashboardGrid.tsx
│       ├── QuickStats.tsx
│       ├── RecentMatches.tsx
│       └── FavoriteTeams.tsx
├── app/
│   ├── page.tsx              # Enhanced landing page
│   └── (protected)/
│       └── dashboard/
│           └── page.tsx      # Enhanced dashboard
└── lib/
    ├── mock-data.ts          # Football mock data
    └── animations.ts         # Animation utilities
```

### Design System

#### Color Palette (Football Theme)

- **Primary Green**: `#00A86B` (Football field green)
- **Secondary Blue**: `#1E40AF` (Classic football blue)
- **Accent Orange**: `#F97316` (Energy and excitement)
- **Dark**: `#1F2937` (Text and headers)
- **Light Gray**: `#F3F4F6` (Backgrounds)
- **White**: `#FFFFFF` (Cards and content)

#### Typography

- **Headings**: Inter font family, bold weights
- **Body**: Inter font family, regular weights
- **Accent**: Roboto Mono for statistics and numbers

#### Spacing System

- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px

## Components and Interfaces

### Landing Page Components

#### HeroSection

```typescript
interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText: string
  backgroundImage?: string
}
```

- Full-screen hero with animated background
- Gradient overlay for text readability
- Animated call-to-action buttons
- Responsive typography scaling

#### FeaturesSection

```typescript
interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface FeaturesSectionProps {
  features: Feature[]
}
```

- Grid layout with feature cards
- Hover animations and icon transitions
- Mobile-responsive stacking

#### StatsSection

```typescript
interface Stat {
  value: string
  label: string
  icon?: React.ReactNode
}

interface StatsSectionProps {
  stats: Stat[]
  title: string
}
```

- Animated counter effects
- Football-themed icons
- Responsive grid layout

### Dashboard Components

#### DashboardGrid

```typescript
interface DashboardGridProps {
  children: React.ReactNode
  className?: string
}
```

- CSS Grid layout with responsive breakpoints
- Auto-fit columns for different screen sizes
- Gap management and padding

#### QuickStats

```typescript
interface QuickStatsProps {
  userStats: {
    favoriteTeams: number
    matchesWatched: number
    predictionsCorrect: number
  }
}
```

- Personal statistics display
- Animated progress indicators
- Color-coded performance metrics

#### RecentMatches

```typescript
interface Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  score: string
  date: Date
  league: string
}

interface RecentMatchesProps {
  matches: Match[]
  limit?: number
}
```

- Scrollable match list
- Team logos and colors
- Live score updates simulation

### Football-Specific Components

#### MatchCard

```typescript
interface MatchCardProps {
  match: Match
  variant?: "compact" | "detailed"
  showDate?: boolean
}
```

- Team vs team layout
- Score display with emphasis
- League badge integration
- Hover effects for interactivity

#### TeamBadge

```typescript
interface TeamBadgeProps {
  team: Team
  size?: "sm" | "md" | "lg"
  showName?: boolean
}
```

- Team logo with fallback
- Consistent sizing system
- Optional team name display

## Data Models

### Team

```typescript
interface Team {
  id: string
  name: string
  shortName: string
  logo: string
  colors: {
    primary: string
    secondary: string
  }
  league: string
  country: string
}
```

### League

```typescript
interface League {
  id: string
  name: string
  country: string
  logo: string
  season: string
  teams: Team[]
}
```

### Match

```typescript
interface Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  score: {
    home: number
    away: number
  } | null
  date: Date
  status: "scheduled" | "live" | "finished"
  league: League
  venue?: string
}
```

### Player

```typescript
interface Player {
  id: string
  name: string
  position: string
  team: Team
  nationality: string
  age: number
  photo: string
  stats: {
    goals: number
    assists: number
    matches: number
  }
}
```

## Error Handling

### Component Error Boundaries

- Wrap major sections in error boundaries
- Graceful fallback UI for failed components
- Error reporting for debugging

### Data Loading States

- Skeleton components for loading states
- Progressive loading for large datasets
- Retry mechanisms for failed requests

### Responsive Breakpoint Failures

- Fallback layouts for unsupported screen sizes
- Progressive enhancement approach
- Touch-friendly interactions on mobile

## Testing Strategy

### Unit Testing

- Component rendering tests with React Testing Library
- Props validation and default behavior
- Animation and interaction testing

### Integration Testing

- Page-level component integration
- Mock data integration testing
- Responsive behavior testing

### Visual Regression Testing

- Screenshot comparison for UI consistency
- Cross-browser compatibility testing
- Mobile device testing

### Performance Testing

- Animation performance monitoring
- Bundle size optimization
- Core Web Vitals compliance

## Animation and Interaction Design

### Entrance Animations

- Fade-in effects for content sections
- Staggered animations for lists and grids
- Scroll-triggered animations using Intersection Observer

### Hover States

- Subtle scale transforms for cards
- Color transitions for interactive elements
- Shadow elevation changes

### Micro-interactions

- Button press feedback
- Form input focus states
- Loading state animations

### Performance Considerations

- CSS transforms over position changes
- Hardware acceleration for smooth animations
- Respect for `prefers-reduced-motion`

## Responsive Design Strategy

### Breakpoints

- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Large Desktop: 1440px+

### Layout Patterns

- Mobile-first approach
- Flexible grid systems
- Progressive disclosure of information
- Touch-friendly interaction areas (44px minimum)

### Content Strategy

- Prioritized content for mobile
- Adaptive navigation patterns
- Optimized image loading for different screen densities

## Implementation Phases

### Phase 1: Foundation

- Set up shadcn/ui components
- Create base football components
- Implement mock data structure

### Phase 2: Landing Page

- Build hero section with animations
- Implement features and stats sections
- Add responsive navigation

### Phase 3: Dashboard Enhancement

- Create dashboard grid system
- Implement data visualization components
- Add interactive elements

### Phase 4: Polish and Optimization

- Fine-tune animations and transitions
- Optimize for performance
- Conduct accessibility audit
