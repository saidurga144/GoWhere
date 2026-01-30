# GoWhere - AI Coding Agent Instructions

## Project Essence

**GoWhere** is a personalized travel discovery app with three interconnected layers:
1. **Frontend**: React 19 + Vite + Tailwind CSS v4 - multi-step preference collection & destination matching UI
2. **Node.js Backend**: Express + Groq SDK - AI recommendation orchestration 
3. **Python Backend**: Flask + Geopy - Location services (optional, not always running)

**Core Value**: Match travelers to destinations via weighted rule-based scoring + Groq AI refinement.

## Architecture & Data Flow

### User Journey (Driven by `AppStep` Enum in `types.ts`)
```
AuthView (Firebase) → IntentSelection → Onboarding (collect preferences)
    ↓
RecommendationView (rule-based, localStorage-boosted)
    ↓
GroqRecommendationView (free-form AI) OR DestinationOptimizer (multi-trip planning)
```

### Key Decision: Why Three Components Overlap?
- **RecommendationView**: Uses deterministic `calculateMatchScore()` with fixed weights (30% budget, 25% style, 20% climate, 15% activities, 10% duration). Interaction history boosts scores by +5 per click.
- **GroqRecommendationView**: Stateless AI mode - users input natural language → Groq JSON-structured response with reasoning.
- **DestinationOptimizer**: Multi-destination trip planning (rarely used).

### Firestore Schema
```
users/{uid}
  ├── email, displayName, photoURL, createdAt
  ├── preferences/travelPrefs { budget, styles[], climate[], duration, interests[] }
  └── recommendations/{docId} { destination, score, savedAt }
```

## Developer Workflows

### Start Development
```bash
npm run dev      # Vite on http://localhost:3000 (MUST HAVE for React HMR)
npm run server   # Node.js on port 3001 (required for /api/analyze → Groq)
npm run dev:all  # Run both concurrently (RECOMMENDED)
```
**Critical**: Frontend alone won't work - it needs the Node backend for Groq API calls.

### Build & Deploy
```bash
npm run build    # Creates dist/ folder
npm run preview  # Test production build locally on :4173
```

### Environment Setup
- **Groq API Key**: Must be in `.env.local` at project root as `GROQ_API_KEY`
- **Firebase**: Config hardcoded in `services/firebaseConfig.ts` (not ideal but safe for this project size)
- **Gemini API**: Optional, used for reasoning explanations (fallback gracefully if missing)

## Code Patterns (Not Generic Best Practices)

### Type Safety Convention
**ALWAYS** import from `types.ts` - never define inline interfaces:
```tsx
// ❌ Don't do this:
interface Prefs { budget: string }

// ✅ Do this:
import { UserPreferences, BudgetRange } from '../types'
```

### Component Laziness Pattern
Expensive components loaded on-demand to speed initial load:
```tsx
const RecommendationView = lazy(() => import('./components/RecommendationView'));
const DestinationMap = lazy(() => import('./DestinationMap'));
// Wrapped in <Suspense fallback={<ComponentLoader />}>
```

### Firebase Session Persistence
App mounts with `useEffect` checking `getCurrentUser()`, loads saved preferences in background (non-blocking). Don't auto-navigate - let user choose via `IntentSelection`.

### Recommendation Scoring Rule
**Higher budget can match lower-cost destinations** (e.g., luxury traveler → budget destination). Reverse is NOT allowed:
```tsx
// In RecommendationEngine.ts:
if (pref.budget === BudgetRange.LUXURY && dest.budgetLevel === BudgetRange.MODERATE) {
  score += weights.budget * 0.7; // Partial match allowed
}
// But Budget traveler cannot match Luxury destination
```

### Groq Integration Quirks
- API calls go through `/api/analyze` (Node backend proxy, NOT direct)
- Backend extracts JSON from text response using regex `\{[\s\S]*\}` (Groq may wrap JSON in text)
- All responses must have `recommendations[]` array - validation happens server-side
- 30-second timeout on frontend requests (`AbortController`)

### Tailwind + CSS Variables
- Import happens via `@import "tailwindcss"` in `globals.css` (PostCSS v4 syntax)
- Theme colors use CSS custom properties: `hsl(var(--primary))`, `hsl(var(--destructive))`
- Use `clsx` + `tailwind-merge` together: `cn(baseClass, conditionalClass)`

### Animation Patterns
- **Framer Motion**: Page transitions, button hovers (< 300ms)
- **Canvas Confetti**: Sign-up success celebration only
- Keep all animations <= 500ms for mobile UX

## Critical Integration Points

### Adding New Preference Option
1. Add to enum in `types.ts` (e.g., `ADVENTURE_LEVEL`)
2. Update `calculateMatchScore()` weights in `RecommendationEngine.ts`
3. Add UI toggle in `Onboarding.tsx` (step 3-5 range)
4. Update `MOCK_DESTINATIONS` in `constants.tsx` with new field values

### Using Groq for New Feature
1. Create new function in `services/groqService.ts` following `analyzeUserInputWithGroq()` pattern
2. Add POST route in `server/index.js` to handle auth + prompt templating
3. Validate JSON response structure before returning to frontend
4. Test with `npm run dev:all`

### Saving User Data
```tsx
// Always pattern: check uid first
if (currentUser?.uid) {
  await saveTravelPreferences(currentUser.uid, preferences);
}
```

## File Map (Purpose → Key Files)

| Task | Files |
|------|-------|
| User auth flow | `services/firebaseService.ts`, `components/AuthView.tsx`, `components/ui/sign-up.tsx` |
| Preference collection | `components/Onboarding.tsx`, `types.ts` |
| Destination matching | `components/RecommendationEngine.ts`, `components/RecommendationView.tsx` |
| AI recommendations | `services/groqService.ts`, `components/GroqRecommendationView.tsx`, `server/index.js` |
| Styling & theming | `globals.css`, `tailwind.config.ts`, `postcss.config.js` |
| Route guards/auth state | `App.tsx` (useEffect with `getCurrentUser()`) |
| Destination data | `constants.tsx` (`MOCK_DESTINATIONS` array) |

## Known Gotchas & Workarounds

- **Empty Groq responses**: Check backend logs first (`npm run server` console), not browser console
- **Firebase not persisting**: Verify `user.uid` is truthy before `.uid` access - use optional chaining
- **Scores not sorting correctly**: Interaction history adds +5 per click - expected behavior for personalization
- **Tailwind styles not hot-reloading**: Restart `npm run dev` if class names added dynamically
- **Leaflet map not loading**: Python backend may be down (port 5000) - app still works without it

## Testing Strategy
- No unit/integration tests (manual workflow only)
- Test full stack: `npm run dev:all`
- Browser console for Firebase/auth errors
- Network tab in DevTools for Groq request inspection
- Python backend console for geolocation errors (if running Flask)

## Key Docs to Reference
- `INTEGRATION_SUMMARY.md`: Architecture + tech stack rationale
- `AUTH_COMPONENT_SETUP.md`: Auth UI & Framer Motion details
- `FIREBASE_GEOPY_SETUP.md`: Backend setup (optional Python layer)
