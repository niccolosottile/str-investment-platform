# STR Investment Platform

React frontend for the STR Investment Platform. Guides investors through a 3-step journey to discover, configure, and analyze short-term rental opportunities.

## Overview

**User Journey:**
1. **Discover** — Interactive map + list view for searching locations and evaluating nearby opportunities
2. **Configure** — Multi-step wizard to define investment type (buy vs rent), budget, property type, and goals
3. **Analyze** — Results dashboard with market metrics, seasonal trends, competition analysis, and ROI projections

**Current State:** UI/UX complete and fully integrated with the backend across all three steps.

## Architecture

**State Management**: React Query for server state. Context API for global UI state (user location, geolocation permissions). sessionStorage for wizard persistence across page reloads.

**Map Integration**: Custom Mapbox GL JS implementation with bidirectional state sync between map viewport and UI components. Browser Geolocation API with permission handling and fallback.

**Component Structure**: shadcn/ui base components composed into domain-specific features. Pages map 1:1 to the 3-step journey plus auth flows.

## Tech Stack

- React 18 + TypeScript
- Vite
- TanStack Query
- Mapbox GL JS
- Tailwind CSS + shadcn/ui
- React Router v6
- Zod

## Project Structure

```
src/
├── pages/          # Route-level components (Index, Wizard, Results, Auth*)
├── components/
│   ├── features/   # Domain-specific components (map, analysis, wizard steps)
│   ├── layouts/    # Page layout wrappers
│   ├── common/     # Shared UI primitives
│   ├── auth/       # Auth flow components
│   └── ui/         # shadcn/ui base components
├── hooks/          # Custom React hooks
├── contexts/       # React context providers
├── server/         # API client + React Query hooks
├── types/          # Shared TypeScript types
└── lib/            # Utilities
```

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# VITE_PUBLIC_MAPBOX_TOKEN=your_token_here
# VITE_API_BASE_URL=http://localhost:8080

# Start dev server
npm run dev

# Build for production
npm run build
```

App runs on `http://localhost:5173`.

## Environment Variables

```bash
VITE_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
VITE_API_BASE_URL=http://localhost:8080
```

## Backend APIs Consumed

```
POST /api/locations/search     - Location search
GET  /api/locations/nearby     - Nearby opportunities
POST /api/driving-time         - Driving time estimates
POST /api/analysis             - Investment analysis results
```

Mapbox Geocoding API is called directly from the client for autocomplete and reverse geocoding.
