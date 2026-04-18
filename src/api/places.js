const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Geocode an address string → { lat, lng, address }.
 * Uses the backend proxy so we don't expose the API key in the browser.
 */
export async function geocodeAddress(address) {
  if (!address || address.length < 2) return null;

  try {
    // Step 1: Get autocomplete predictions
    const ac = await fetch(`${API_URL}/api/places/autocomplete?input=${encodeURIComponent(address)}&language=en`);
    const acData = await ac.json();
    const predictions = acData.predictions || [];
    if (!predictions.length) return null;

    // Step 2: Get details (lat/lng) for the top prediction
    const dt = await fetch(`${API_URL}/api/places/details?place_id=${predictions[0].place_id}`);
    const dtData = await dt.json();
    if (dtData.result?.geometry?.location) {
      return {
        lat: dtData.result.geometry.location.lat,
        lng: dtData.result.geometry.location.lng,
        address: dtData.result.formatted_address || address,
      };
    }
  } catch {
    /* silent – will surface as error in caller */
  }
  return null;
}

/**
 * Returns place-search results for autocomplete dropdowns.
 */
export async function searchPlaces(query) {
  if (!query || query.length < 2) return [];
  const res = await fetch(`${API_URL}/api/places/autocomplete?input=${encodeURIComponent(query)}&language=en`);
  const data = await res.json();
  return data.predictions || [];
}

/**
 * Resolves a place_id → { lat, lng, address, name }.
 */
export async function getPlaceDetails(placeId) {
  const res = await fetch(`${API_URL}/api/places/details?place_id=${encodeURIComponent(placeId)}`);
  const data = await res.json();
  if (data.result?.geometry?.location) {
    return {
      lat: data.result.geometry.location.lat,
      lng: data.result.geometry.location.lng,
      address: data.result.formatted_address || '',
      name: data.result.name || '',
    };
  }
  return null;
}
