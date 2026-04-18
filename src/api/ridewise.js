const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function compareRides({ pickup, destination }) {
  const res = await fetch(`${API_URL}/api/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pickup, destination }),
  });

  if (!res.ok) throw new Error('Failed to fetch ride estimates');
  const json = await res.json();

  const rides = Object.entries(json.estimates).map(([id, est]) => ({
    providerId: id,
    name: est.label,
    icon: est.icon,
    priceMin: est.priceMin,
    priceMax: est.priceMax,
    etaMin: est.etaMin,
    etaMax: est.etaMax,
    badge: est.badge,
    surge: est.surge,
    deeplink: '',
    webFallback: '',
    brandColor: {
      uber_auto: '#FF6B00',
      uber_go: '#276EF1',
      ola_auto: '#06B05F',
      rapido_bike: '#FFD500',
    }[id] || '#64748B',
  }));

  // Compute highlights locally
  const cheapest = [...rides].sort((a, b) => a.priceMin - b.priceMin)[0];
  const fastest = [...rides].sort((a, b) => a.etaMin - b.etaMin)[0];

  const highlights = {
    cheapestProviderId: cheapest?.providerId || null,
    fastestProviderId: fastest?.providerId || null,
    mostReliableProviderId: null,
  };

  return {
    rides,
    highlights,
    route: json.route,
    warnings: [],
    providerNotices: [],
    suggestions: [],
  };
}
