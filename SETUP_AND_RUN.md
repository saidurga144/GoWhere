# GoWhere - Complete Setup & Run Guide

## ✅ Issues Fixed

### 1. ✓ Onboarding Validation (Travel Styles/Climate Selection)
- **Issue**: Users could proceed without selecting options
- **Fix**: Added `canProceed()` validation that requires:
  - Step 2: At least 1 travel style selected
  - Step 3: At least 1 climate preference selected
  - Step 4: At least 1 interest selected
- **Visual Feedback**: 
  - Warning message appears if no selections made
  - "Next Step" button is disabled (grayed out) if validation fails

### 2. ✓ NetworkError when calling Groq API
- **Issue**: "NetworkError when attempting to fetch resource" - backend server not running
- **Fix**: Improved error messages that tell users exactly what to do:
  - Shows: `❌ Backend server not running! Please run: npm run server (or npm run dev:all)`
  - Applies to all AI API calls (analyze, refine, itinerary)

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start All Servers (Choose One)

**Option A: Easiest (Run Everything at Once)**
```bash
npm run dev:all
```
This starts:
- ✅ Vite frontend (localhost:3000)
- ✅ Node.js/Express backend (localhost:3001) - REQUIRED for AI backend
- ⚠️ Note: Python Flask backend (port 5000) starts separately

**Option B: Run Each Separately**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend Server (REQUIRED for AI):
```bash
npm run server
```

Terminal 3 - Python Flask (Optional, for geocoding):
```bash
cd backend && pip install -r requirements.txt && python app.py
```

### Step 3: Open in Browser
```
http://localhost:3000
```

---

## 📋 Verification Checklist

After starting servers, verify everything is running:

```
Frontend (Vite)
  ✓ http://localhost:3000 - Opens without error
  
Backend Server (Node.js/Express)
  ✓ http://localhost:3001/api/analyze - Should respond with error if POST sent, NOT network error
  
Python Flask (Optional)
  ✓ http://localhost:5000/api/geocode - For location services
```

---

## 🎯 Testing the App

### 1. Test Onboarding Validation
1. Click "Get Recommendations" in IntentSelection
2. Go to "Choose your travel styles" (Step 2)
3. Try clicking "Next Step" WITHOUT selecting any style
   - ✅ Button should be disabled (gray)
   - ✅ Warning message appears: "👇 Select at least one travel style to continue"
4. Select a style (e.g., "Adventure")
5. ✅ Button becomes enabled (blue) and you can proceed

### 2. Test AI Recommendations
1. Complete onboarding (select budget, styles, climate, interests, duration)
2. Click "Get Recommendations"
3. System should:
   - ✅ Show loading spinner
   - ✅ Call backend server (check Network tab in DevTools)
   - ✅ Display AI-generated recommendations OR
   - ❌ Show helpful error: "❌ Backend server not running! Please run: npm run server"

### 3. Troubleshooting AI Errors

**Error: "❌ Backend server not running"**
→ Run: `npm run server` in a new terminal

**Error: "Failed to analyze user input"**
→ Check browser DevTools Console for details
→ Make sure `VITE_GEMINI_API_KEY` or `GEMINI_API_KEY` is set in `.env.local` if using Gemini

If you see an error about missing AI API keys, add the appropriate env variable to `.env.local` and restart the server.

---

## 🛠️ Environment Variables

Create a `.env` file in the project root if you need to customize settings:

```env
# AI backend keys (example for Gemini)
VITE_GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key

# Backend port (default 3001)
PORT=3001

# Firebase (already in firebaseConfig.ts)
# Only needed if changing from the default config
```

---

## 📝 Common Commands

```bash
# Development
npm run dev              # Frontend only
npm run server          # Backend Node.js server
npm run dev:all         # Frontend + Backend together

# Production
npm run build           # Build for production
npm run preview         # Test production build locally

# Python Backend
cd backend
pip install -r requirements.txt
python app.py
```

---

## 🔍 Debug Tips

### Check if servers are running:
```bash
# Frontend (Vite)
curl http://localhost:3000

# Backend (Node.js)
curl http://localhost:3001

# Python (if needed)
curl http://localhost:5000
```

### View backend logs:
- When running `npm run server`, check terminal for:
  - `Server running on port 3001` ✅
  - API request logs
  - Error messages

### View frontend logs:
- Open browser DevTools (F12)
- Go to Console tab
- Look for network errors or validation messages

### View network requests:
- DevTools → Network tab
- Make a request (e.g., "Get Recommendations")
- Check if calls go to `localhost:3001` and what responses are received

---

## ✨ What's Working Now

✅ **Onboarding**
- Travel style selection (required)
- Climate preference selection (required)
- Interest selection (required)
- Duration slider
- Seasonal availability dropdown

✅ **Authentication**
- Email/password signup
- Google Sign-In
- Session persistence

✅ **AI Recommendations** (when backend running)
- Backend AI integration (Gemini or other configured provider)
- Travel preference analysis
- Destination recommendations
- Itinerary generation

✅ **Error Handling**
- Clear messages for missing server
- Validation feedback on incomplete forms
- Network error details

---

## 🆘 Still Having Issues?

1. **Validate all three servers are running** (if using them):
   ```bash
   lsof -i :3000  # Frontend
   lsof -i :3001  # Backend
   lsof -i :5000  # Python
   ```

2. **Check terminal output** for error messages

3. **Clear browser cache**:
   - DevTools → Application → Clear storage → Clear all

4. **Check firebaseConfig.ts** has correct credentials

5. **Verify .env or environment variables** are set for API keys

---

## 📚 Related Documentation

- [.github/copilot-instructions.md](.github/copilot-instructions.md) - For AI agents
- [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) - Architecture overview
- [AUTH_COMPONENT_SETUP.md](AUTH_COMPONENT_SETUP.md) - Auth details
- [FIREBASE_GEOPY_SETUP.md](FIREBASE_GEOPY_SETUP.md) - Backend setup
