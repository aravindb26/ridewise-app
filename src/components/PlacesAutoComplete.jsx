import React, { useState, useEffect, useRef, useCallback } from 'react';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function loadGoogleMapsScript(callback) {
  if (window.google?.maps?.places) {
    callback();
    return;
  }
  const existing = document.getElementById('google-maps-script');
  if (existing) {
    existing.addEventListener('load', callback);
    return;
  }
  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places&loading=async`;
  script.async = true;
  script.defer = true;
  script.addEventListener('load', callback);
  document.head.appendChild(script);
}

export default function PlacesAutoComplete({
  label,
  placeholder,
  icon: Icon,
  onSelect,
  value: externalValue = '',
  initialValue = '',
}) {
  const [value, setValue] = useState(externalValue || initialValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [placesService, setPlacesService] = useState(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Places service
  useEffect(() => {
    loadGoogleMapsScript(() => {
      setPlacesService(new google.maps.places.AutocompleteService());
    });
  }, []);

  // Debounce search
  useEffect(() => {
    if (!value || !placesService || value.length < 2) {
      setPredictions([]);
      return;
    }
    const timer = setTimeout(() => {
      placesService.getPlacePredictions(
        { input: value, types: ['geocode', 'establishment'] },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setPredictions(results);
          } else {
            setPredictions([]);
          }
        }
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [value, placesService]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = useCallback(
    (prediction) => {
      setValue(prediction.description);
      setShowDropdown(false);
      setPredictions([]);

      // Get place details (coordinates)
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );
      service.getDetails(
        { placeId: prediction.place_id, fields: ['geometry.location', 'formatted_address', 'name'] },
        (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result?.geometry?.location) {
            onSelect({
              name: prediction.structured_formatting?.main_text || prediction.description,
              address: prediction.description,
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng(),
            });
          }
        }
      );
    },
    [onSelect]
  );

  return (
    <div ref={wrapperRef} className="relative">
      {/* Label */}
      {(label || Icon) && (
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
          {Icon}
          {label}
        </label>
      )}

      {/* Input field */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border-2 transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:shadow-lg">
        <Icon className="text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-base text-gray-800 placeholder-gray-400"
        />
        {value && (
          <button
            onClick={() => {
              setValue('');
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && predictions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-72 overflow-y-auto z-50">
          {predictions.map((p) => (
            <button
              key={p.place_id}
              onClick={() => handleSelect(p)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 flex items-start gap-3"
            >
              <span className="text-lg mt-0.5">📍</span>
              <div>
                <div className="font-medium text-sm text-gray-800">
                  {p.structured_formatting?.main_text || p.description}
                </div>
                {p.structured_formatting?.secondary_text && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {p.structured_formatting.secondary_text}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
