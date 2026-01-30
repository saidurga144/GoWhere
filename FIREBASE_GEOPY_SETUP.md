# Firebase & Geopy Integration Guide

## ✅ Firebase Integration - COMPLETED

Your React application now has complete Firebase integration with:

### 1. **Firebase Authentication**
- Email/Password registration and login
- Automatic session persistence
- Secure authentication via Firebase Auth

### 2. **Firestore Database**
The following collections are set up:
```
users/
├── {uid}/
│   ├── (Basic profile data)
│   └── preferences/
│       └── travelPrefs (Travel preferences)
│   └── recommendations/
│       └── (Saved destination recommendations)
```

### 3. **Firebase Storage**
- Ready for storing user travel photos and destination images

### 4. **Available Functions**
All Firebase operations are in `services/firebaseService.ts`:
- `registerUser()` - Sign up
- `loginUser()` - Sign in
- `logoutUser()` - Sign out
- `createUserProfile()` - Create user data
- `getUserProfile()` - Fetch user data
- `saveTravelPreferences()` - Save travel preferences
- `getTravelPreferences()` - Load travel preferences
- `saveDestinationRecommendation()` - Save recommendations
- `getDestinationRecommendations()` - Load recommendations

---

## 🗺️ Geopy Integration - Python Backend Required

**Important:** Geopy is a Python library that runs on a backend server, NOT in the browser. To integrate geopy for location/mapping services, you need to create a **Python backend API**.

### Option 1: Node.js/Express Backend (Recommended for ease)
If you want to stay in Node.js, use these alternatives:
- **Leaflet.js** - Open-source map library
- **Google Maps API** - For geocoding and distance calculations
- **OpenStreetMap** - Free alternative with geolocation services

### Option 2: Python Backend with Geopy (Recommended for advanced features)

#### Step 1: Create Python Backend Structure
```
backend/
├── app.py
├── requirements.txt
├── config.py
├── routes/
│   ├── __init__.py
│   └── location.py
└── services/
    ├── __init__.py
    └── geopy_service.py
```

#### Step 2: Install Dependencies
```bash
pip install flask flask-cors python-dotenv geopy firebase-admin
```

#### Step 3: Example Python Backend (app.py)
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize geocoder
geolocator = Nominatim(user_agent="gowhere_app")

@app.route('/api/geocode', methods=['POST'])
def geocode_location():
    """Convert location name to coordinates"""
    data = request.json
    location_name = data.get('location')
    
    try:
        location = geolocator.geocode(location_name)
        if location:
            return jsonify({
                'success': True,
                'latitude': location.latitude,
                'longitude': location.longitude,
                'address': location.address
            })
        return jsonify({'success': False, 'error': 'Location not found'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/reverse-geocode', methods=['POST'])
def reverse_geocode():
    """Convert coordinates to location name"""
    data = request.json
    lat = data.get('latitude')
    lon = data.get('longitude')
    
    try:
        location = geolocator.reverse(f"{lat}, {lon}")
        return jsonify({
            'success': True,
            'address': location.address
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/distance', methods=['POST'])
def calculate_distance():
    """Calculate distance between two locations"""
    data = request.json
    loc1 = (data.get('lat1'), data.get('lon1'))
    loc2 = (data.get('lat2'), data.get('lon2'))
    
    try:
        distance = geodesic(loc1, loc2).km
        return jsonify({
            'success': True,
            'distance_km': distance,
            'distance_miles': distance * 0.621371
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

#### Step 4: Frontend API Client (services/locationService.ts)
```typescript
const API_URL = 'http://localhost:5000/api';

export const geocodeLocation = async (location: string) => {
  const response = await fetch(`${API_URL}/geocode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location })
  });
  return response.json();
};

export const reverseGeocode = async (latitude: number, longitude: number) => {
  const response = await fetch(`${API_URL}/reverse-geocode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude, longitude })
  });
  return response.json();
};

export const calculateDistance = async (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
) => {
  const response = await fetch(`${API_URL}/distance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat1, lon1, lat2, lon2 })
  });
  return response.json();
};
```

---

## 🚀 Next Steps

1. **Test Firebase Integration**
   - Run your app: `npm run dev`
   - Create an account and verify Firestore is saving data
   - Check Firebase Console

2. **Choose Mapping Solution**
   - For simple maps: Use **Leaflet.js** or **Google Maps API**
   - For advanced geolocation: Set up **Python backend with Geopy**

3. **Environment Variables**
   Add to your `.env` file if needed:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyDER5w9KKEUD8ZC9FT0st7knuaHQoSXKYI
   VITE_FIREBASE_PROJECT_ID=studio-6695301123-9c419
   ```

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Geopy Documentation](https://geopy.readthedocs.io/)
- [Leaflet.js Documentation](https://leafletjs.com/)
- [Google Maps API](https://developers.google.com/maps)
