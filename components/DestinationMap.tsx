import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Recommendation } from '../types';
import { getDestinationCoordinates } from '../services/destinationCoordinates';

interface DestinationMapProps {
  recommendations: Recommendation[];
  selectedDestination?: string;
}

// Custom icon for markers
const createCustomIcon = (isSelected: boolean) => {
  return L.icon({
    iconUrl: isSelected 
      ? 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="10" fill="%23a78bfa" stroke="%237c3aed" stroke-width="2"/%3E%3Ccircle cx="12" cy="12" r="4" fill="%237c3aed"/%3E%3C/svg%3E'
      : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="10" fill="%2306b6d4" stroke="%230891b2" stroke-width="2"/%3E%3Ccircle cx="12" cy="12" r="4" fill="%230891b2"/%3E%3C/svg%3E',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const DestinationMap: React.FC<DestinationMapProps> = ({ recommendations, selectedDestination }) => {
  const { center, markers } = useMemo(() => {
    const validMarkers = recommendations
      .map((rec) => ({
        rec,
        coords: getDestinationCoordinates(rec.destination),
      }))
      .filter((item) => item.coords !== null);

    if (validMarkers.length === 0) {
      // Default to world center if no valid destinations
      return {
        center: [20, 0] as [number, number],
        markers: [],
      };
    }

    // Calculate center from all markers
    const avgLat =
      validMarkers.reduce((sum, item) => sum + (item.coords?.latitude || 0), 0) /
      validMarkers.length;
    const avgLon =
      validMarkers.reduce((sum, item) => sum + (item.coords?.longitude || 0), 0) /
      validMarkers.length;

    return {
      center: [avgLat, avgLon] as [number, number],
      markers: validMarkers,
    };
  }, [recommendations]);

  return (
    <div className="w-full h-96 sm:h-screen rounded-lg overflow-hidden border-2 border-purple-500/30">
      <MapContainer
        center={center}
        zoom={selectedDestination ? 5 : 2}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {markers.map((item) => (
          <Marker
            key={item.rec.destination}
            position={[item.coords!.latitude, item.coords!.longitude]}
            icon={createCustomIcon(item.rec.destination === selectedDestination)}
          >
            <Popup>
              <div className="p-2 min-w-max">
                <h3 className="font-bold text-sm">{item.rec.destination}</h3>
                <p className="text-xs text-slate-600">{item.rec.country}</p>
                <p className="text-xs mt-1 text-slate-700 font-semibold">
                  {item.rec.estimatedCost}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DestinationMap;
