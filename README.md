# STR Investment Platform

Web application for analyzing short-term rental investment opportunities across Europe.

> **Note**: This repository contains the frontend implementation. The backend is maintained separately.

## Overview

The platform aggregates market data from Airbnb, Booking.com, and VRBO to help investors analyze ROI potential for short-term rental properties.

**Workflow:**
1. **Discover** - Interactive map showing investment opportunities based on location search
2. **Configure** - Define investment parameters (buy vs rent, budget, property type, goals)
3. **Analyze** - View market analysis, competition metrics, seasonal trends, and ROI projections

## Technical Implementation

**Architecture:**
- TypeScript throughout for type safety
- React Query for server state management
- Context API for global UI state (user location, permissions)
- sessionStorage for persistence

**Map Integration:**
- Custom Mapbox GL JS implementation handling marker rendering and viewport management
- Bidirectional state sync between map interactions and UI components
- Browser Geolocation API with permission handling

**Component Structure:**
- Shadcn/ui for base components
- Domain-specific composition
- Built for reusability

### Tech Stack

- React 18 + TypeScript
- Vite
- TanStack Query
- Mapbox GL JS
- Tailwind CSS + shadcn/ui
- React Router v6
- Zod

**APIs:**
- Mapbox Geocoding (location search)
- Browser Geolocation API

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Mapbox token: VITE_PUBLIC_MAPBOX_TOKEN=your_token_here

# Start dev server
npm run dev

# Build for production
npm run build
```
