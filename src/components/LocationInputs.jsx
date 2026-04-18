import React, { useState, useEffect, useRef } from 'react';
import { searchPlaces } from '../api/places.js';

function SearchInput({ label, value, onChange }) {
  const [query, setQuery] = useState(value?.address || '');
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef(null);
  const timer = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sync external value change
  useEffect(() => { setQuery(value?.address || ''); }, [value]);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const r = await searchPlaces(query);
      setResults(r);
    }, 300);
  }, [query]);

  const handleSelect = async (item) => {
    setQuery(item.description);
    setFocused(false);
    // Resolve coords
    const res = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/places/details?place_id=${item.place_id}`
    );
    const data = await res.json();
    if (data.result?.geometry?.location) {
      onChange({
        address: item.description,
        lat: data.result.geometry.location.lat,
        lng: data.result.geometry.location.lng,
      });
    } else {
      onChange({ address: item.description, lat: null, lng: null });
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setFocused(true); }}
        onFocus={() => setFocused(true)}
        placeholder="Type an address, landmark, or saved name…"
        className="w-full rounded-xl border border-slate-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
      />
      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 max-h-64 overflow-y-auto">
          {results.map((r) => (
            <button key={r.place_id} onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-slate-50 last:border-b-0 flex items-start gap-3">
              <span className="text-amber-500 mt-0.5">📍</span>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{r.structured_formatting?.main_text}</div>
                {r.structured_formatting?.secondary_text && (
                  <div className="text-xs text-slate-500 truncate">{r.structured_formatting.secondary_text}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function LocationInputs({ pickup, destination, onPickupChange, onDestinationChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <SearchInput label="From" value={pickup} onChange={onPickupChange} />
      <SearchInput label="To" value={destination} onChange={onDestinationChange} />
    </div>
  );
}
