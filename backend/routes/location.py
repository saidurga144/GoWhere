from flask import Blueprint, request, jsonify
from services.geopy_service import GeopyService

location_bp = Blueprint('location', __name__)
geopy_service = GeopyService()

@location_bp.route('/geocode', methods=['POST'])
def geocode_location():
    """Convert location name to coordinates"""
    data = request.json
    location_name = data.get('location')
    result = geopy_service.geocode_location(location_name)
    return jsonify(result)

@location_bp.route('/reverse-geocode', methods=['POST'])
def reverse_geocode():
    """Convert coordinates to location name"""
    data = request.json
    lat = data.get('latitude')
    lon = data.get('longitude')
    result = geopy_service.reverse_geocode(lat, lon)
    return jsonify(result)

@location_bp.route('/distance', methods=['POST'])
def calculate_distance():
    """Calculate distance between two locations"""
    data = request.json
    lat1 = data.get('lat1')
    lon1 = data.get('lon1')
    lat2 = data.get('lat2')
    lon2 = data.get('lon2')
    result = geopy_service.calculate_distance(lat1, lon1, lat2, lon2)
    return jsonify(result)
