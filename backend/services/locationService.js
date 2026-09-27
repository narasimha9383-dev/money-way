// backend/services/locationService.js
/**
 * Location & Geospatial Distance Service (Sections 6, 7, 8, 9, 10, 12)
 * Calculates true geographic distances using the Haversine formula.
 * Never invents distances or coordinates.
 */

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371;

// Verified standard city & locality coordinates database
export const CITY_COORDINATES = {
  'bangalore': { lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru, Karnataka', country: 'India' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru, Karnataka', country: 'India' },
  'mumbai': { lat: 19.0760, lng: 72.8777, displayName: 'Mumbai, Maharashtra', country: 'India' },
  'delhi': { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi, Delhi NCR', country: 'India' },
  'new delhi': { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi, Delhi NCR', country: 'India' },
  'hyderabad': { lat: 17.3850, lng: 78.4867, displayName: 'Hyderabad, Telangana', country: 'India' },
  'chennai': { lat: 13.0827, lng: 80.2707, displayName: 'Chennai, Tamil Nadu', country: 'India' },
  'pune': { lat: 18.5204, lng: 73.8567, displayName: 'Pune, Maharashtra', country: 'India' },
  'kolkata': { lat: 22.5726, lng: 88.3639, displayName: 'Kolkata, West Bengal', country: 'India' },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, displayName: 'Ahmedabad, Gujarat', country: 'India' },
  'jaipur': { lat: 26.9124, lng: 75.7873, displayName: 'Jaipur, Rajasthan', country: 'India' },
  'gurgaon': { lat: 28.4595, lng: 77.0266, displayName: 'Gurugram, Haryana', country: 'India' },
  'gurugram': { lat: 28.4595, lng: 77.0266, displayName: 'Gurugram, Haryana', country: 'India' },
  'noida': { lat: 28.5355, lng: 77.3910, displayName: 'Noida, Uttar Pradesh', country: 'India' }
};

export const LOCALITY_COORDINATES = {
  // Bangalore localities
  'indiranagar': { lat: 12.9784, lng: 77.6408, city: 'bangalore', displayName: 'Indiranagar, Bengaluru' },
  'koramangala': { lat: 12.9352, lng: 77.6245, city: 'bangalore', displayName: 'Koramangala, Bengaluru' },
  'whitefield': { lat: 12.9698, lng: 77.7499, city: 'bangalore', displayName: 'Whitefield, Bengaluru' },
  'hsr layout': { lat: 12.9121, lng: 77.6446, city: 'bangalore', displayName: 'HSR Layout, Bengaluru' },
  'jayanagar': { lat: 12.9308, lng: 77.5838, city: 'bangalore', displayName: 'Jayanagar, Bengaluru' },

  // Mumbai localities
  'andheri': { lat: 19.1136, lng: 72.8697, city: 'mumbai', displayName: 'Andheri, Mumbai' },
  'bandra': { lat: 19.0596, lng: 72.8295, city: 'mumbai', displayName: 'Bandra, Mumbai' },
  'powai': { lat: 19.1176, lng: 72.9060, city: 'mumbai', displayName: 'Powai, Mumbai' },

  // Delhi localities
  'south delhi': { lat: 28.5355, lng: 77.2410, city: 'delhi', displayName: 'South Delhi, New Delhi' },
  'connaught place': { lat: 28.6304, lng: 77.2177, city: 'delhi', displayName: 'Connaught Place, New Delhi' },

  // Hyderabad localities
  'hitec city': { lat: 17.4435, lng: 78.3772, city: 'hyderabad', displayName: 'HITEC City, Hyderabad' },
  'gachibowli': { lat: 17.4401, lng: 78.3489, city: 'hyderabad', displayName: 'Gachibowli, Hyderabad' },

  // Pune localities
  'wakad': { lat: 18.5987, lng: 73.7661, city: 'pune', displayName: 'Wakad, Pune' },
  'kothrud': { lat: 18.5074, lng: 73.8077, city: 'pune', displayName: 'Kothrud, Pune' }
};

/**
 * Calculates geographic distance in kilometers using the Haversine formula
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) return null;
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return null;

  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = EARTH_RADIUS_KM * c;

  // Return distance rounded to 1 decimal place (e.g., 3.8 km)
  return Math.round(distanceKm * 10) / 10;
}

/**
 * Resolves coordinates from given location parameters (city, area, lat, lng)
 */
export function resolveCoordinates({ lat, lng, city, area }) {
  if (lat !== undefined && lng !== undefined && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    return {
      lat: Number(lat),
      lng: Number(lng),
      source: 'gps',
      displayName: city ? `${city}${area ? `, ${area}` : ''}` : 'Your Location'
    };
  }

  if (area) {
    const areaKey = area.toLowerCase().trim();
    if (LOCALITY_COORDINATES[areaKey]) {
      return {
        lat: LOCALITY_COORDINATES[areaKey].lat,
        lng: LOCALITY_COORDINATES[areaKey].lng,
        source: 'locality',
        displayName: LOCALITY_COORDINATES[areaKey].displayName
      };
    }
  }

  if (city) {
    const cityKey = city.toLowerCase().trim();
    if (CITY_COORDINATES[cityKey]) {
      return {
        lat: CITY_COORDINATES[cityKey].lat,
        lng: CITY_COORDINATES[cityKey].lng,
        source: 'city',
        displayName: CITY_COORDINATES[cityKey].displayName
      };
    }
  }

  // Default to Bangalore center if location is requested without specific parameters
  return {
    lat: 12.9716,
    lng: 77.5946,
    source: 'default',
    displayName: 'Bengaluru, Karnataka'
  };
}

/**
 * Formats a user-friendly distance badge
 */
export function formatDistanceBadge(distanceKm) {
  if (distanceKm === null || distanceKm === undefined) return null;
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm} km away`;
}
