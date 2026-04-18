import React, { useState, useEffect, useRef } from 'react';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Load Google Maps JS SDK dynamically
function loadScript() {
  return new Promise((resolve) => {
    if (window.google?.maps?.places) return resolve(true);
    if (document.getElementById('gm-sdk')) return;
    const s = document.createElement('script');
    s.id = 'gm-sdk';
    s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places`;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(true);
    document.head.appendChild(s);
  });
}

export default function PlacesInput({ label, placeholder, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);
  const svcRef = useRef(null);

  // init places service once
  useEffect(() => {
    loadScript().then(() => {
      svcRef.current = new google.maps.places.AutocompleteService();
    });
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setFocused(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // debounced search
  useEffect(() => {
    if (!query || !svcRef.current || query.length < 2) { setResults([]); return; }
    const t = setTimeout(() => {
      svcRef.current.getPlacePredictions(
        { input: query, types: ['geocode', 'establishment'], componentRestrictions: { country: 'IN' } },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) setResults(predictions);
          else setResults([]);
        }
      );
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSelect = (item) => {
    setFocused(false);
    setResults([]);
    setQuery(item.description);

    // fetch coordinates
    const div = document.createElement('div');
    new google.maps.places.PlacesService(div).getDetails(
      { placeId: item.place_id, fields: ['geometry', 'formatted_address', 'name'] },
      (r, s) => {
        if (s === google.maps.places.PlacesServiceStatus.OK && r.geometry) {
          onSelect({
            name: item.structured_formatting?.main_text || item.description,
            address: r.formatted_address || item.description,
            lat: r.geometry.location.lat(),
            lng: r.geometry.location.lng(),
          });
        }
      }
    );
  };

  return (
    <div ref={ref} className="relative mb-3">
      {label && (
        <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1 block">{label}</label>
      )}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 bg-gray-50 transition-all duration-200 ${focused ? 'border-primary bg-white shadow-lg' : 'border-transparent'}`}>
        <span className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">✕</button>
        )}
      </div>

      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-72 overflow-y-auto">
          {results.map((r) => (
            <button key={r.place_id} onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-start gap-3 border-b border-gray-50 last:border-b-0 transition-colors">
              <span className="text-gray-400 mt-0.5">📍</span>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{r.structured_formatting?.main_text}</div>
                {r.structured_formatting?.secondary_text && (
                  <div className="text-xs text-gray-500 truncate max-w-xs">{r.structured_formatting.secondary_text}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      {focused && results.length === 0 && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border p-4 text-center text-sm text-gray-400 z-50">No results</div>
      )}
    </div>
  );
}
