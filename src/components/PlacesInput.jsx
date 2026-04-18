import React, { useState, useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function PlacesInput({ label, placeholder, onSelect, value: externalValue }) {
  const [query, setQuery] = useState(externalValue || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/places/autocomplete?input=${encodeURIComponent(query)}&language=en`
        );
        const data = await res.json();
        setResults(data.predictions || []);
      } catch (err) {
        console.error('Places autocomplete error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  const handleSelect = async (prediction) => {
    setLoading(true);
    setFocused(false);
    setResults([]);
    setQuery(prediction.description);

    try {
      const res = await fetch(
        `${API_URL}/api/places/details?place_id=${prediction.place_id}`
      );
      const data = await res.json();
      if (data.result?.geometry?.location) {
        const loc = data.result.geometry.location;
        onSelect({
          name: prediction.structured_formatting?.main_text || prediction.description,
          address: data.result.formatted_address || prediction.description,
          lat: loc.lat,
          lng: loc.lng,
          placeId: prediction.place_id,
        });
      }
    } catch (err) {
      console.error('Place details error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
          {label}
        </label>
      )}
      <div className={`flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border-2 transition-all duration-200 ${focused ? 'border-primary bg-white shadow-lg' : 'border-transparent hover:border-gray-200'}`}>
        <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setFocused(true); }}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
        />
        {loading && (
          <svg className="w-4 h-4 animate-spin text-primary" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" />
          </svg>
        )}
      </div>
      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-72 overflow-y-auto">
          {results.map((p) => (
            <button
              key={p.place_id}
              onClick={() => handleSelect(p)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-b-0 flex items-start gap-3 transition-colors"
            >
              <span className="text-gray-400 mt-0.5">📍</span>
              <div>
                <div className="text-sm font-medium text-gray-800">{p.structured_formatting?.main_text || p.description}</div>
                {p.structured_formatting?.secondary_text && (
                  <div className="text-xs text-gray-500 truncate max-w-xs">{p.structured_formatting.secondary_text}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      {focused && results.length === 0 && query.length > 2 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border p-4 text-center text-sm text-gray-400 z-50">
          No results found
        </div>
      )}
    </div>
  );
}
