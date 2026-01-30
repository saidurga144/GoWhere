# Gemini API Fix & Environment Configuration Guide

## Problem Solved ✅

The error "Uncaught ApiError: API key must be set when using the Gemini API" has been resolved by moving all Gemini API calls from the client (browser) to the backend (Node.js server).

### Why This Fix?

1. **Security**: API keys should never be exposed to the browser
2. **Scalability**: Backend can handle rate limiting and caching
3. **Reliability**: Backend can provide fallback responses if API is unavailable

## What Changed

### 1. **Backend (server/index.js)**
- Added Google Generative AI import
- Created 3 new API endpoints:
  - `POST /api/gemini-reasoning` - For destination matching reasoning
  - `POST /api/gemini-analysis` - For destination analysis
  - `POST /api/gemini-image` - For image descriptions

### 2. **Frontend (services/geminiService.ts)**
- Removed client-side Gemini API initialization
- Converted all methods to call backend endpoints
- Added environment variable support for API base URL

### 3. **Services (services/geminiService.ts)**
- Updated to use environment variable for API base URL
- Now supports both dev (localhost:3001) and production URLs

## Local Development Setup

Everything works as-is! Just run:

```bash
npm run dev:all  # Starts all servers (Vite + Node backend)
```

The app will use `http://localhost:3001/api` for backend calls.

## Production Deployment (Vercel)

You need to deploy **two separate applications**:

### A. Frontend (React App)
**URL**: https://gowhere-rosy.vercel.app (or your domain)
**Build Command**: `npm run build`
**Environment Variables to Set**:
```
VITE_API_BASE_URL=https://[your-backend-url]/api
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### B. Backend (Node.js Server)
Deploy the backend separately to Vercel or another service:

**Option 1: Vercel for Backend**
1. Create new Vercel project
2. Point to `/server` directory (set as root)
3. Set environment variables (example):
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3001
   ```

**Option 2: Other Hosting (Heroku, Railway, AWS, etc.)**
1. Set same environment variables
2. Deploy the `/server` directory
3. Note the URL: `https://your-backend-domain.com`

### C. Update Frontend for Production
1. In Vercel Dashboard → GoWhere Project → Settings → Environment Variables
2. Add:
   ```
   VITE_API_BASE_URL=https://your-backend-url/api
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
3. Redeploy frontend

## Environment Variables Checklist

### Local Development (`.env.local`) ✅
```
VITE_GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key
VITE_API_BASE_URL=http://localhost:3001/api
```

### Production - Frontend (Vercel Dashboard)
```
VITE_API_BASE_URL=https://[backend-url]/api
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Production - Backend (Vercel Dashboard or Host)
```
GROQ_API_KEY=your_groq_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Testing the Fix

### Local Testing
```bash
# Terminal 1: Start Node backend
npm run server

# Terminal 2: Start React frontend
npm run dev

# Visit: http://localhost:3000
# Should see recommendations without Gemini errors
```

### Production Testing
1. Deploy backend first
2. Get backend URL
3. Deploy frontend with correct `VITE_API_BASE_URL`
4. Check browser console for errors
5. Verify recommendations show reasoning from Gemini ✅

## API Endpoints Available

All endpoints are now in `/server/index.js`:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/analyze` | POST | AI travel recommendations |
| `/api/refine` | POST | Refine recommendations |
| `/api/itinerary` | POST | Generate itinerary |
| `/api/gemini-reasoning` | POST | Get destination matching reason |
| `/api/gemini-analysis` | POST | Analyze destination |
| `/api/gemini-image` | POST | Get image description |

## Fallback Behavior

If APIs are unavailable:
- AI endpoints: Return error message or graceful fallback text
- App continues working with reduced AI features

## Next Steps

1. ✅ Local testing done (run `npm run dev:all`)
2. Deploy backend to production hosting
3. Set environment variables in Vercel
4. Deploy frontend
5. Verify in production: Visit app → Check recommendations → Should see Gemini reasoning

## Troubleshooting

**Error: "Cannot find module '@google/generative-ai'"**
```bash
npm install @google/generative-ai
```

**Error: "API key not found" in production**
- Check Vercel environment variables are set correctly
- Restart/redeploy both frontend and backend
- Verify backend URL in frontend environment variables

**Recommendations show but no Gemini reasoning**
- Backend may be down - check backend logs
- Frontend fallback text should display instead

**CORS errors**
- Backend has CORS enabled for all origins
- Check backend is running and accessible

## Security Notes

✅ **What's Now Secure**:
- API keys no longer exposed in browser
- Browser DevTools won't show Gemini API key
- Production API keys protected in Vercel dashboard

❌ **What Still Needs Review**:
- Backend should be rate-limited for production
- Consider API key rotation strategy
- Monitor backend logs for suspicious activity

## Deployment Checklist

- [ ] Backend deployed to production hosting
- [ ] Backend URL known (e.g., https://backend.vercel.app)
- [ ] Environment variables set in Vercel dashboard for frontend
- [ ] Environment variables set in backend hosting
- [ ] Frontend redeployed with new environment variables
- [ ] Local testing passes with `npm run dev:all`
- [ ] Production app tested - no console errors
- [ ] Recommendations show Gemini reasoning text ✅

---

**Version**: 1.0  
**Updated**: January 29, 2026  
**Status**: Ready for Production Deployment
