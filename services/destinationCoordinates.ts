/**
 * Destination Coordinates Database
 * Maps destination names to their latitude and longitude coordinates
 */

export interface DestinationCoords {
  destination: string;
  country: string;
  latitude: number;
  longitude: number;
}

export const DESTINATION_COORDINATES: { [key: string]: DestinationCoords } = {
  "Kyoto": {
    destination: "Kyoto",
    country: "Japan",
    latitude: 35.0116,
    longitude: 135.7681
  },
  "Bali": {
    destination: "Bali",
    country: "Indonesia",
    latitude: -8.6705,
    longitude: 115.2126
  },
  "Reykjavik": {
    destination: "Reykjavik",
    country: "Iceland",
    latitude: 64.1466,
    longitude: -21.9426
  },
  "Santorini": {
    destination: "Santorini",
    country: "Greece",
    latitude: 36.3932,
    longitude: 25.4615
  },
  "Paris": {
    destination: "Paris",
    country: "France",
    latitude: 48.8566,
    longitude: 2.3522
  },
  "Tokyo": {
    destination: "Tokyo",
    country: "Japan",
    latitude: 35.6762,
    longitude: 139.6503
  },
  "New York": {
    destination: "New York",
    country: "United States",
    latitude: 40.7128,
    longitude: -74.0060
  },
  "London": {
    destination: "London",
    country: "United Kingdom",
    latitude: 51.5074,
    longitude: -0.1278
  },
  "Dubai": {
    destination: "Dubai",
    country: "United Arab Emirates",
    latitude: 25.2048,
    longitude: 55.2708
  },
  "Barcelona": {
    destination: "Barcelona",
    country: "Spain",
    latitude: 41.3851,
    longitude: 2.1734
  },
  "Rome": {
    destination: "Rome",
    country: "Italy",
    latitude: 41.9028,
    longitude: 12.4964
  },
  "Amalfi": {
    destination: "Amalfi",
    country: "Italy",
    latitude: 40.6333,
    longitude: 14.6029
  },
  "Amsterdam": {
    destination: "Amsterdam",
    country: "Netherlands",
    latitude: 52.3676,
    longitude: 4.9041
  },
  "Bangkok": {
    destination: "Bangkok",
    country: "Thailand",
    latitude: 13.7563,
    longitude: 100.5018
  },
  "Phuket": {
    destination: "Phuket",
    country: "Thailand",
    latitude: 8.1193,
    longitude: 98.3073
  },
  "Chiang Mai": {
    destination: "Chiang Mai",
    country: "Thailand",
    latitude: 18.7883,
    longitude: 98.9853
  },
  "Singapore": {
    destination: "Singapore",
    country: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198
  },
  "Hong Kong": {
    destination: "Hong Kong",
    country: "Hong Kong",
    latitude: 22.3193,
    longitude: 114.1694
  },
  "Beijing": {
    destination: "Beijing",
    country: "China",
    latitude: 39.9042,
    longitude: 116.4074
  },
  "Shanghai": {
    destination: "Shanghai",
    country: "China",
    latitude: 31.2304,
    longitude: 121.4737
  },
  "Sydney": {
    destination: "Sydney",
    country: "Australia",
    latitude: -33.8688,
    longitude: 151.2093
  },
  "Melbourne": {
    destination: "Melbourne",
    country: "Australia",
    latitude: -37.8136,
    longitude: 144.9631
  },
  "Auckland": {
    destination: "Auckland",
    country: "New Zealand",
    latitude: -37.7852,
    longitude: 175.2847
  },
  "Los Angeles": {
    destination: "Los Angeles",
    country: "United States",
    latitude: 34.0522,
    longitude: -118.2437
  },
  "San Francisco": {
    destination: "San Francisco",
    country: "United States",
    latitude: 37.7749,
    longitude: -122.4194
  },
  "Miami": {
    destination: "Miami",
    country: "United States",
    latitude: 25.7617,
    longitude: -80.1918
  },
  "Toronto": {
    destination: "Toronto",
    country: "Canada",
    latitude: 43.6532,
    longitude: -79.3832
  },
  "Vancouver": {
    destination: "Vancouver",
    country: "Canada",
    latitude: 49.2827,
    longitude: -123.1207
  },
  "Mexico City": {
    destination: "Mexico City",
    country: "Mexico",
    latitude: 19.4326,
    longitude: -99.1332
  },
  "Cancun": {
    destination: "Cancun",
    country: "Mexico",
    latitude: 21.1619,
    longitude: -87.0484
  },
  "Rio de Janeiro": {
    destination: "Rio de Janeiro",
    country: "Brazil",
    latitude: -22.9068,
    longitude: -43.1729
  },
  "São Paulo": {
    destination: "São Paulo",
    country: "Brazil",
    latitude: -23.5505,
    longitude: -46.6333
  },
  "Buenos Aires": {
    destination: "Buenos Aires",
    country: "Argentina",
    latitude: -34.6037,
    longitude: -58.3816
  },
  "Cape Town": {
    destination: "Cape Town",
    country: "South Africa",
    latitude: -33.9249,
    longitude: 18.4241
  },
  "Johannesburg": {
    destination: "Johannesburg",
    country: "South Africa",
    latitude: -26.2023,
    longitude: 28.0436
  },
  "Cairo": {
    destination: "Cairo",
    country: "Egypt",
    latitude: 30.0444,
    longitude: 31.2357
  },
  "Marrakech": {
    destination: "Marrakech",
    country: "Morocco",
    latitude: 31.6295,
    longitude: -7.9811
  },
  "Istanbul": {
    destination: "Istanbul",
    country: "Turkey",
    latitude: 41.0082,
    longitude: 28.9784
  },
  "Dubrovnik": {
    destination: "Dubrovnik",
    country: "Croatia",
    latitude: 42.6426,
    longitude: 18.1092
  },
  "Prague": {
    destination: "Prague",
    country: "Czech Republic",
    latitude: 50.0755,
    longitude: 14.4378
  },
  "Vienna": {
    destination: "Vienna",
    country: "Austria",
    latitude: 48.2082,
    longitude: 16.3738
  },
  "Venice": {
    destination: "Venice",
    country: "Italy",
    latitude: 45.4408,
    longitude: 12.3155
  },
  "Florence": {
    destination: "Florence",
    country: "Italy",
    latitude: 43.7696,
    longitude: 11.2558
  },
  "Milan": {
    destination: "Milan",
    country: "Italy",
    latitude: 45.4642,
    longitude: 9.1900
  },
  "Lisbon": {
    destination: "Lisbon",
    country: "Portugal",
    latitude: 38.7223,
    longitude: -9.1393
  },
  "Madrid": {
    destination: "Madrid",
    country: "Spain",
    latitude: 40.4168,
    longitude: -3.7038
  },
  "Athens": {
    destination: "Athens",
    country: "Greece",
    latitude: 37.9838,
    longitude: 23.7275
  },
  "Mykonos": {
    destination: "Mykonos",
    country: "Greece",
    latitude: 37.4467,
    longitude: 25.3288
  },
  "Crete": {
    destination: "Crete",
    country: "Greece",
    latitude: 35.3387,
    longitude: 25.1615
  },
  "Interlaken": {
    destination: "Interlaken",
    country: "Switzerland",
    latitude: 46.6863,
    longitude: 8.1590
  },
  "Lucerne": {
    destination: "Lucerne",
    country: "Switzerland",
    latitude: 47.0502,
    longitude: 8.3093
  },
  "Zurich": {
    destination: "Zurich",
    country: "Switzerland",
    latitude: 47.3769,
    longitude: 8.5472
  }
};

/**
 * Get coordinates for a destination by name
 * @param destinationName The name of the destination
 * @returns The coordinates or null if not found
 */
export const getDestinationCoordinates = (destinationName: string): DestinationCoords | null => {
  return DESTINATION_COORDINATES[destinationName] || null;
};

/**
 * Get all destination coordinates
 * @returns Array of all destination coordinates
 */
export const getAllDestinations = (): DestinationCoords[] => {
  return Object.values(DESTINATION_COORDINATES);
};
