# STR Investment Platform

A modern web application for analyzing short-term rental investment opportunities across Europe. This project demonstrates production-ready frontend architecture and my approach to building scalable, data-intensive applications.

> **Note**: This repository contains the frontend implementation. The backend (scraping services, data processing, APIs) is maintained separately.

## What This Project Does

Investors looking to enter the STR market face a major problem: scattered data across multiple platforms (Airbnb, Booking.com, VRBO) and no easy way to analyze ROI potential. This tool aims to solve that by aggregating market data and providing actionable insights.

The workflow is simple:
1. **Discover** - Interactive map showing investment opportunities based on your location or search
2. **Configure** - Define your investment parameters (buy vs rent, budget, property type, goals)
3. **Analyze** - View detailed market analysis, competition metrics, seasonal trends, and ROI projections

## Technical Highlights

### Architecture Decisions

**TypeScript Throughout**: Strict typing for better DX and fewer runtime errors. Every component, hook, and utility is fully typed.

**State Management**: React Query handles server state, Context API for global UI state (user location, permissions), sessionStorage for persistence. Avoided heavyweight state libraries.

**Map Integration**: Custom Mapbox GL JS solution handling marker rendering, viewport management, and animations. Solved bidirectional state sync between map interactions and UI components (card clicks center map, marker clicks highlight cards).

**Geolocation**: Browser Geolocation API with proper permission handling and error states. Integrated with Mapbox Directions API for real driving time calculations between locations.

**Component Architecture**: Shadcn/ui for primitives, composed into domain-specific components. Built for reusability without over abstraction.

### Tech Stack

**Frontend**:
- React 18 + TypeScript
- Vite (fast builds, HMR)
- TanStack Query (server state)
- Mapbox GL JS (interactive maps)
- Tailwind CSS + shadcn/ui (styling)
- React Router v6 (routing)
- Zod (runtime validation)

**APIs in Use**:
- Mapbox Geocoding (location search with autocomplete)
- Mapbox Directions (real driving time calculations)
- Browser Geolocation API (user positioning)

## Backend Design

The frontend is ready for integration. Here's what I'm building on the backend:

**Scraping Layer**: Playwright-based scrapers for Airbnb, Booking.com, and VRBO. Handles rate limiting, proxy rotation, and data deduplication. Built in Python because it's the right tool for this job.

**Data Pipeline**: PostgreSQL for structured data (properties, pricing, metrics), Redis for caching (24hr TTL on market analyses), RabbitMQ for job queues. Standard architecture but important to get right for performance.

**API Layer**: Java Spring Boot REST API. Endpoints for location search, nearby opportunities (with driving time filtering), and full investment analysis. Response times under 2s for cached data, under 30s for fresh scraping.

**ML Components**: Working on occupancy prediction models and ROI estimation using historical STR data. Nothing fancy yet, just linear regression and time series forecasting, but it'll improve as I gather more training data.

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

The app runs entirely in the browser right now. No backend needed for development since it uses mock data.
