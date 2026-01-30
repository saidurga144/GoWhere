# ⚡ Quick Start - Fixed & Functional

## 🚀 Start Application (CORRECT WAY)

### Terminal 1 - Start Backend
```bash
cd c:\Users\Sai Kumar\Downloads\gowhere_-personalized-travel-discovery
node server/index.js
```

**Expected Output:**
```
Server running on port 3001
```

### Terminal 2 - Start Frontend
```bash
cd c:\Users\Sai Kumar\Downloads\gowhere_-personalized-travel-discovery
npm run dev
```

**Expected Output:**
```
VITE v6.4.1  ready in XXX ms
➜  Local:   http://localhost:3000/
(or another port if 3000 is busy)
```

---

## ✅ Access Application

Open in browser: **http://localhost:3000/** (or assigned port shown in terminal)

---

## 🎯 Test "Get AI Recommendations" Feature

1. **Login** with email or Google
2. Click **"Explore with AI"** button
3. Fill form:
   - 💰 Budget: Select budget level
   - 👥 Group: Choose Single/Couple/Family
   - 📅 Duration: Set days (1-30)
   - 🎒 Style: Pick at least one style
   - ❤️ Interests: Pick at least one interest
   - 🌤️ Climate: Pick at least one climate
4. Click **"Get AI Recommendations"**
5. Wait for the AI backend to generate personalized Indian destination recommendations

---

## 🔍 Verify Everything Works

### Backend Health Check
Terminal 1 should show these logs when you click "Get AI Recommendations":
```
📨 Received recommendation request:
  Budget: moderate
  Duration: 7 days
  Travel Style: Adventure, Cultural
  Interests: History, Food
  Climate: Tropical
✅ Response data received: {...recommendations...}
```

### Frontend Network Check
1. Open Browser DevTools (F12)
2. Go to **Network** tab
3. Click "Get AI Recommendations"
4. Look for request: `POST /api/analyze`
5. Status should be **200** (green)
6. Response should have `recommendations` array with destinations

---

## 📍 Expected Destinations (India Only)

All recommendations will be Indian states:
- ✅ Kerala
- ✅ Rajasthan
- ✅ Himachal Pradesh
- ✅ Goa
- ✅ Tamil Nadu
- ✅ Uttarakhand
- ✅ Jaipur
- ✅ West Bengal
- ✅ Maharashtra
- ✅ Karnataka

---

## 🐛 Troubleshooting

### Issue: "Cannot read properties of undefined"
**Solution**: 
- Terminal 1: Verify `✅ Groq client initialized successfully` is shown
- Terminal 2: Check for errors in frontend console (F12)
- Restart both servers

### Issue: Port Already in Use
**Solution**:
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Then restart
node server/index.js  # Terminal 1
npm run dev          # Terminal 2
```

### Issue: No Recommendations Returned
**Solution**:
- Check backend terminal for errors
- Verify `VITE_GEMINI_API_KEY` or `GEMINI_API_KEY` in `.env.local` if using Gemini
- Check that you selected both travel style AND interests
- Check browser console for error messages

### Issue: CORS Errors
**Solution**: This is fixed by the Vite proxy - should not happen. If it does:
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Restart both servers

---

## ✨ What's Been Fixed

✅ **Error Solved**: Backend server now starts and stays running
✅ **API Communication**: Vite proxy properly routes `/api` calls to backend
✅ **AI Integration**: API key loads correctly, client initializes
✅ **Indian Destinations**: All 10 Indian states available for recommendations
✅ **Group Type Selector**: Single/Couple/Family options on both pages
✅ **Form Labels**: All questions have emoji prefixes for clarity
✅ **Build**: Application compiles with zero errors (2013 modules ✓)

---

## 📊 Build Status

```
✓ 2013 modules transformed
✓ Built in 6.07s
✓ Zero errors
✓ Production ready
```

---

## 🎉 You're All Set!

The application is now fully functional with:
- Real AI recommendations powered by Groq
- Beautiful Indian destination suggestions
- Group-aware travel planning (Single/Couple/Family)
- Clear, emoji-labeled form questions
- Robust error handling and validation

**Happy travels! 🌏**

