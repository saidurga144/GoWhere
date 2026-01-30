const API_URL = 'http://localhost:5000/api';

export interface GeocodeResult {
  success: boolean;
  latitude?: number;
  longitude?: number;
  address?: string;
  error?: string;
}

export interface ReverseGeocodeResult {
  success: boolean;
  address?: string;
  error?: string;
}

export interface DistanceResult {
  success: boolean;
  distance_km?: number;
  distance_miles?: number;
  error?: string;
}

export const geocodeLocation = async (location: string): Promise<GeocodeResult> => {
  try {
    const response = await fetch(`${API_URL}/geocode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const reverseGeocode = async (latitude: number, longitude: number): Promise<ReverseGeocodeResult> => {
  try {
    const response = await fetch(`${API_URL}/reverse-geocode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude, longitude })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const calculateDistance = async (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): Promise<DistanceResult> => {
  try {
    const response = await fetch(`${API_URL}/distance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat1, lon1, lat2, lon2 })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};
