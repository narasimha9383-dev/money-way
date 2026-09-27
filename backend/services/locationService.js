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
  'noida': { lat: 28.5355, lng: 77.3910, displayName: 'Noida, Uttar Pradesh', country: 'India' },
  // Andhra Pradesh Cities & Hubs
  'vadlamudi': { lat: 16.2372, lng: 80.5562, displayName: 'Vadlamudi, Guntur, Andhra Pradesh', country: 'India' },
  'tenali': { lat: 16.2430, lng: 80.6400, displayName: 'Tenali, Andhra Pradesh', country: 'India' },
  'guntur': { lat: 16.3067, lng: 80.4365, displayName: 'Guntur, Andhra Pradesh', country: 'India' },
  'vijayawada': { lat: 16.5062, lng: 80.6480, displayName: 'Vijayawada, Andhra Pradesh', country: 'India' },
  'amaravati': { lat: 16.5131, lng: 80.5165, displayName: 'Amaravati, Andhra Pradesh', country: 'India' },
  'visakhapatnam': { lat: 17.6868, lng: 83.2185, displayName: 'Visakhapatnam, Andhra Pradesh', country: 'India' },
  'vizag': { lat: 17.6868, lng: 83.2185, displayName: 'Visakhapatnam, Andhra Pradesh', country: 'India' },
  'tirupati': { lat: 13.6288, lng: 79.4192, displayName: 'Tirupati, Andhra Pradesh', country: 'India' }
};

export const LOCALITY_COORDINATES = {
  // Andhra Pradesh localities (Vadlamudi, Tenali, Guntur, Vijayawada corridor)
  'vadlamudi': { lat: 16.2372, lng: 80.5562, city: 'guntur', displayName: 'Vadlamudi, Guntur, Andhra Pradesh' },
  'chebrolu': { lat: 16.1983, lng: 80.5283, city: 'guntur', displayName: 'Chebrolu, Guntur, Andhra Pradesh' },
  'tenali': { lat: 16.2430, lng: 80.6400, city: 'guntur', displayName: 'Tenali, Andhra Pradesh' },
  'mangalagiri': { lat: 16.4344, lng: 80.5670, city: 'guntur', displayName: 'Mangalagiri, Andhra Pradesh' },
  'bapatla': { lat: 15.9042, lng: 80.4678, city: 'guntur', displayName: 'Bapatla, Andhra Pradesh' },
  'guntur': { lat: 16.3067, lng: 80.4365, city: 'guntur', displayName: 'Guntur, Andhra Pradesh' },
  'vijayawada': { lat: 16.5062, lng: 80.6480, city: 'vijayawada', displayName: 'Vijayawada, Andhra Pradesh' },
  'amaravati': { lat: 16.5131, lng: 80.5165, city: 'guntur', displayName: 'Amaravati, Andhra Pradesh' },
  'narasaraopet': { lat: 16.2359, lng: 80.0494, city: 'guntur', displayName: 'Narasaraopet, Andhra Pradesh' },

  // Hyderabad localities (comprehensive)
  'madhapur': { lat: 17.4483, lng: 78.3915, city: 'hyderabad', displayName: 'Madhapur, Hyderabad' },
  'hitec city': { lat: 17.4435, lng: 78.3772, city: 'hyderabad', displayName: 'HITEC City, Hyderabad' },
  'gachibowli': { lat: 17.4401, lng: 78.3489, city: 'hyderabad', displayName: 'Gachibowli, Hyderabad' },
  'kondapur': { lat: 17.4699, lng: 78.3578, city: 'hyderabad', displayName: 'Kondapur, Hyderabad' },
  'kukatpally': { lat: 17.4947, lng: 78.3996, city: 'hyderabad', displayName: 'Kukatpally, Hyderabad' },
  'kphb': { lat: 17.4938, lng: 78.4018, city: 'hyderabad', displayName: 'KPHB Colony, Hyderabad' },
  'banjara hills': { lat: 17.4156, lng: 78.4357, city: 'hyderabad', displayName: 'Banjara Hills, Hyderabad' },
  'jubilee hills': { lat: 17.4319, lng: 78.4073, city: 'hyderabad', displayName: 'Jubilee Hills, Hyderabad' },
  'begumpet': { lat: 17.4447, lng: 78.4664, city: 'hyderabad', displayName: 'Begumpet, Hyderabad' },
  'secunderabad': { lat: 17.4399, lng: 78.4983, city: 'hyderabad', displayName: 'Secunderabad, Hyderabad' },
  'somajiguda': { lat: 17.4256, lng: 78.4583, city: 'hyderabad', displayName: 'Somajiguda, Hyderabad' },
  'ameerpet': { lat: 17.4375, lng: 78.4483, city: 'hyderabad', displayName: 'Ameerpet, Hyderabad' },
  'miyapur': { lat: 17.4968, lng: 78.3548, city: 'hyderabad', displayName: 'Miyapur, Hyderabad' },
  'uppal': { lat: 17.4018, lng: 78.5602, city: 'hyderabad', displayName: 'Uppal, Hyderabad' },
  'charminar': { lat: 17.3616, lng: 78.4747, city: 'hyderabad', displayName: 'Charminar, Hyderabad' },
  'dilsukhnagar': { lat: 17.3688, lng: 78.5247, city: 'hyderabad', displayName: 'Dilsukhnagar, Hyderabad' },

  // Bangalore localities
  'indiranagar': { lat: 12.9784, lng: 77.6408, city: 'bangalore', displayName: 'Indiranagar, Bengaluru' },
  'koramangala': { lat: 12.9352, lng: 77.6245, city: 'bangalore', displayName: 'Koramangala, Bengaluru' },
  'whitefield': { lat: 12.9698, lng: 77.7499, city: 'bangalore', displayName: 'Whitefield, Bengaluru' },
  'hsr layout': { lat: 12.9121, lng: 77.6446, city: 'bangalore', displayName: 'HSR Layout, Bengaluru' },
  'jayanagar': { lat: 12.9308, lng: 77.5838, city: 'bangalore', displayName: 'Jayanagar, Bengaluru' },
  'electronic city': { lat: 12.8399, lng: 77.6770, city: 'bangalore', displayName: 'Electronic City, Bengaluru' },
  'bellandur': { lat: 12.9304, lng: 77.6784, city: 'bangalore', displayName: 'Bellandur, Bengaluru' },
  'marathahalli': { lat: 12.9591, lng: 77.6974, city: 'bangalore', displayName: 'Marathahalli, Bengaluru' },

  // Mumbai localities
  'andheri': { lat: 19.1136, lng: 72.8697, city: 'mumbai', displayName: 'Andheri, Mumbai' },
  'bandra': { lat: 19.0596, lng: 72.8295, city: 'mumbai', displayName: 'Bandra, Mumbai' },
  'powai': { lat: 19.1176, lng: 72.9060, city: 'mumbai', displayName: 'Powai, Mumbai' },
  'thane': { lat: 19.2183, lng: 72.9781, city: 'mumbai', displayName: 'Thane, Mumbai MMR' },
  'navi mumbai': { lat: 19.0330, lng: 73.0297, city: 'mumbai', displayName: 'Navi Mumbai, Maharashtra' },

  // Delhi & NCR localities
  'south delhi': { lat: 28.5355, lng: 77.2410, city: 'delhi', displayName: 'South Delhi, New Delhi' },
  'connaught place': { lat: 28.6304, lng: 77.2177, city: 'delhi', displayName: 'Connaught Place, New Delhi' },
  'cyber hub': { lat: 28.4950, lng: 77.0895, city: 'gurgaon', displayName: 'DLF Cyber City, Gurugram' },
  'sector 62 noida': { lat: 28.6256, lng: 77.3628, city: 'noida', displayName: 'Sector 62, Noida' },

  // Pune localities
  'wakad': { lat: 18.5987, lng: 73.7661, city: 'pune', displayName: 'Wakad, Pune' },
  'kothrud': { lat: 18.5074, lng: 73.8077, city: 'pune', displayName: 'Kothrud, Pune' },
  'hinjewadi': { lat: 18.5913, lng: 73.7389, city: 'pune', displayName: 'Hinjewadi, Pune' },
  'vimannagar': { lat: 18.5679, lng: 73.9143, city: 'pune', displayName: 'Viman Nagar, Pune' },

  // Chennai localities
  'omr': { lat: 12.8797, lng: 80.2279, city: 'chennai', displayName: 'Old Mahabalipuram Rd, Chennai' },
  'guindy': { lat: 13.0067, lng: 80.2025, city: 'chennai', displayName: 'Guindy, Chennai' },
  't nagar': { lat: 13.0418, lng: 80.2341, city: 'chennai', displayName: 'T. Nagar, Chennai' }
};

/**
 * Calculates geographic distance in kilometers using the Haversine formula
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) return null;
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return null;
  const numLat1 = Number(lat1);
  const numLon1 = Number(lon1);
  const numLat2 = Number(lat2);
  const numLon2 = Number(lon2);
  if (isNaN(numLat1) || isNaN(numLon1) || isNaN(numLat2) || isNaN(numLon2)) return null;

  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(numLat2 - numLat1);
  const dLon = toRad(numLon2 - numLon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(numLat1)) * Math.cos(toRad(numLat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = EARTH_RADIUS_KM * c;

  // Return distance rounded to 1 decimal place (e.g., 3.8 km)
  return Math.round(distanceKm * 10) / 10;
}

// In-memory geocoding and reverse geocoding cache for fast repeated queries
const geocodeCache = new Map();
const reverseGeocodeCache = new Map();

/**
 * Dynamically geocodes any place, village, city, town, or pincode using OpenStreetMap Nominatim
 * No hardcoded limits — works for any location worldwide.
 */
export async function dynamicGeocode(query = '') {
  if (!query || typeof query !== 'string') return null;
  const cleanQuery = query.trim();
  if (!cleanQuery) return null;

  const cacheKey = cleanQuery.toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  // 1. Quick lookup in local fast lookup tables
  if (CITY_COORDINATES[cacheKey]) {
    const res = {
      lat: CITY_COORDINATES[cacheKey].lat,
      lng: CITY_COORDINATES[cacheKey].lng,
      displayName: CITY_COORDINATES[cacheKey].displayName,
      source: 'local_database'
    };
    geocodeCache.set(cacheKey, res);
    return res;
  }

  if (LOCALITY_COORDINATES[cacheKey]) {
    const res = {
      lat: LOCALITY_COORDINATES[cacheKey].lat,
      lng: LOCALITY_COORDINATES[cacheKey].lng,
      displayName: LOCALITY_COORDINATES[cacheKey].displayName,
      source: 'local_database'
    };
    geocodeCache.set(cacheKey, res);
    return res;
  }

  // 2. Dynamic live geocoding query
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanQuery)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MoneyWay-JobDiscovery/2.0 (contact@moneyway.internal)'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const res = {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          displayName: item.display_name,
          source: 'osm_nominatim'
        };
        geocodeCache.set(cacheKey, res);
        return res;
      }
    }
  } catch (err) {
    console.warn(`Dynamic geocode network error for "${cleanQuery}":`, err.message);
  }

  return null;
}

/**
 * Dynamically reverse-geocodes GPS coordinates (lat, lng) into human-readable place name
 */
export async function dynamicReverseGeocode(lat, lng) {
  if (lat === null || lat === undefined || lng === null || lng === undefined) return null;
  const numLat = Number(lat);
  const numLng = Number(lng);
  if (isNaN(numLat) || isNaN(numLng)) return null;

  const cacheKey = `${numLat.toFixed(3)},${numLng.toFixed(3)}`;
  if (reverseGeocodeCache.has(cacheKey)) {
    return reverseGeocodeCache.get(cacheKey);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${numLat}&lon=${numLng}&format=json`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MoneyWay-JobDiscovery/2.0 (contact@moneyway.internal)'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        const placeName = addr.village || addr.suburb || addr.town || addr.city || addr.county || '';
        const district = addr.state_district || addr.county || '';
        const state = addr.state || '';
        const postcode = addr.postcode || '';

        const parts = [placeName, district !== placeName ? district : null, state, postcode].filter(Boolean);
        const displayName = parts.length > 0 ? parts.join(', ') : data.display_name;

        const result = {
          lat: numLat,
          lng: numLng,
          displayName,
          placeName,
          district,
          state,
          postcode,
          fullAddress: data.display_name,
          source: 'osm_reverse'
        };
        reverseGeocodeCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn(`Dynamic reverse geocode error for (${lat}, ${lng}):`, err.message);
  }

  // Fallback to formatted coordinates string if network is unreachable
  return {
    lat: numLat,
    lng: numLng,
    displayName: `${numLat.toFixed(3)}°, ${numLng.toFixed(3)}°`,
    source: 'coordinates'
  };
}

/**
 * Resolves coordinates from given location parameters (city, area, lat, lng, pincode)
 * Synchronous version checking local known maps and cache
 */
export function resolveCoordinates({ lat, lng, city, area, pincode } = {}) {
  if (lat !== undefined && lng !== undefined && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    return {
      lat: Number(lat),
      lng: Number(lng),
      source: 'gps',
      displayName: city ? `${city}${area ? `, ${area}` : ''}` : 'Your GPS Location'
    };
  }

  const query = [area, city, pincode].filter(Boolean).join(' ').toLowerCase().trim();
  if (query && geocodeCache.has(query)) {
    return geocodeCache.get(query);
  }

  if (area) {
    const areaKey = String(area).toLowerCase().trim();
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
    const cityKey = String(city).toLowerCase().trim();
    if (CITY_COORDINATES[cityKey]) {
      return {
        lat: CITY_COORDINATES[cityKey].lat,
        lng: CITY_COORDINATES[cityKey].lng,
        source: 'city',
        displayName: CITY_COORDINATES[cityKey].displayName
      };
    }
    // Check if locality match exists within city string
    for (const [key, loc] of Object.entries(LOCALITY_COORDINATES)) {
      if (cityKey.includes(key)) {
        return {
          lat: loc.lat,
          lng: loc.lng,
          source: 'locality',
          displayName: loc.displayName
        };
      }
    }
  }

  // Pincode prefix heuristics for regions
  if (pincode) {
    const pin = String(pincode).trim();
    if (pin.startsWith('522')) {
      return { lat: 16.2372, lng: 80.5562, source: 'pincode', displayName: `Guntur / Tenali / Vadlamudi Region (${pin})` };
    }
    if (pin.startsWith('520') || pin.startsWith('521')) {
      return { lat: 16.5062, lng: 80.6480, source: 'pincode', displayName: `Vijayawada / Krishna Region (${pin})` };
    }
    if (pin.startsWith('530')) {
      return { lat: 17.6868, lng: 83.2185, source: 'pincode', displayName: `Visakhapatnam (${pin})` };
    }
    if (pin.startsWith('517')) {
      return { lat: 13.6288, lng: 79.4192, source: 'pincode', displayName: `Tirupati (${pin})` };
    }
    if (pin.startsWith('500')) {
      return { lat: 17.3850, lng: 78.4867, source: 'pincode', displayName: `Hyderabad (${pin})` };
    }
    if (pin.startsWith('560')) {
      return { lat: 12.9716, lng: 77.5946, source: 'pincode', displayName: `Bengaluru (${pin})` };
    }
    if (pin.startsWith('400')) {
      return { lat: 19.0760, lng: 72.8777, source: 'pincode', displayName: `Mumbai (${pin})` };
    }
    if (pin.startsWith('110')) {
      return { lat: 28.6139, lng: 77.2090, source: 'pincode', displayName: `Delhi (${pin})` };
    }
    if (pin.startsWith('600')) {
      return { lat: 13.0827, lng: 80.2707, source: 'pincode', displayName: `Chennai (${pin})` };
    }
    if (pin.startsWith('411')) {
      return { lat: 18.5204, lng: 73.8567, source: 'pincode', displayName: `Pune (${pin})` };
    }
  }

  return null;
}

/**
 * Asynchronously resolves coordinates with full live OSM geocoding fallback
 * Guarantees zero hardcoded location restrictions.
 */
export async function resolveCoordinatesAsync({ lat, lng, city, area, pincode, location } = {}) {
  // 1. Direct GPS coordinates provided
  if (lat !== undefined && lng !== undefined && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    // Reverse geocode to get real place name
    const rev = await dynamicReverseGeocode(Number(lat), Number(lng));
    return {
      lat: Number(lat),
      lng: Number(lng),
      source: 'gps',
      displayName: rev?.displayName || 'Your GPS Location'
    };
  }

  // 2. Synchronous fast database/cache check
  const syncMatch = resolveCoordinates({ city: city || location, area, pincode });
  if (syncMatch) return syncMatch;

  // 3. Dynamic geocode search
  const query = [area, city || location, pincode].filter(Boolean).join(', ');
  if (query) {
    const geo = await dynamicGeocode(query);
    if (geo) return geo;
  }

  return null;
}

/**
 * Returns reliable coordinates for an opportunity or location string
 * Never invents coordinates; returns null if not verifiable.
 */
export function getCoordinatesForLocation(locString = '') {
  if (!locString || typeof locString !== 'string') return null;
  const lower = locString.toLowerCase();
  if (lower.includes('remote') || lower === 'anywhere' || lower.includes('not specified')) return null;

  // 1. Check exact localities first (more granular)
  for (const [key, loc] of Object.entries(LOCALITY_COORDINATES)) {
    if (lower.includes(key)) {
      return { lat: loc.lat, lng: loc.lng, name: loc.displayName };
    }
  }

  // 2. Check major cities
  for (const [key, city] of Object.entries(CITY_COORDINATES)) {
    if (lower.includes(key)) {
      return { lat: city.lat, lng: city.lng, name: city.displayName };
    }
  }

  return null;
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

