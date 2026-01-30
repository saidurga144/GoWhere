from flask import Flask, request, jsonify
from flask_cors import CORS
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import os
from dotenv import load_dotenv
# Initialize geocoder
geolocator = Nominatim(user_agent="gowhere_app")
# Removed Groq client initialization

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
