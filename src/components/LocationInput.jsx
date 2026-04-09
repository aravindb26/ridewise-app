import React, { useState } from 'react';
import { locationSuggestions } from '../data/mockData';

const LocationInput = ({ type, value, onChange, onSelect }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const icon = type === 'pickup' ? '📍' : '🚩';
  const placeholder = type === 'pickup' ? 'Where are you?' : 'Where to?';

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 0) {
      const filtered = locationSuggestions.filter((loc) =>
        loc.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        loc.address.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (location) => {
    onSelect(location);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-3 p-4 bg-white border border-neutral-border rounded-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <span className="text-2xl">{icon}</span>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="flex-1 outline-none text-base placeholder-neutral-text-muted"
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-border rounded-lg shadow-card-hover max-h-64 overflow-y-auto z-10">
          {filteredSuggestions.map((location) => (
            <button
              key={location.id}
              onClick={() => handleSelectSuggestion(location)}
              className="w-full text-left px-4 py-3 hover:bg-primary/5 flex items-start space-x-3 border-b border-neutral-border last:border-b-0"
            >
              <span className="text-lg mt-0.5">📍</span>
              <div className="flex-1">
                <div className="font-semibold text-neutral-text-primary text-sm">
                  {location.name}
                </div>
                <div className="text-xs text-neutral-text-secondary">
                  {location.address}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && filteredSuggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-border rounded-lg shadow-card-hover p-4 text-center text-sm text-neutral-text-muted z-10">
          No results found. Try a different search.
        </div>
      )}
    </div>
  );
};

export default LocationInput;
