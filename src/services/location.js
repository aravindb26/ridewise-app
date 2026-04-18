// Google Places search via backend proxy (hides API key)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function searchPlaces(query, center) {
  const res = await fetch(`${API_BASE_URL}/api/places/autocomplete?input=${encodeURIComponent(query)}&lat=${center.lat}&lng=${center.lng}`, {
    headers: { 'Accept': 'application/json' }
  });
  const data = await res.json();
  return data.predictions || [];
}

export async function getPlaceDetails(placeId) {
  const res = await fetch(`${API_BASE_URL}/api/places/details?place_id=${placeId}`, {
    headers: { 'Accept': 'application/json' }
  });
  const data = await res.json();
  if (data.result?.geometry) {
    return {
      lat: data.result.geometry.location.lat,
      lng: data.result.geometry.location.lng,
      name: data.result.name || data.result.formatted_address,
      address: data.result.formatted_address,
    };
  }
  return null;
}
