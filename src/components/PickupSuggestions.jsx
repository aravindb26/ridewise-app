import React from 'react';

export function PickupSuggestions({ suggestions, selectedId, onSelect }) {
  if (!suggestions?.length) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">💡 Alternative pickups</h3>
      <div className="space-y-2">
        {suggestions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`w-full text-left rounded-xl px-4 py-3 text-sm transition ${
              selectedId === s.id
                ? 'bg-blue-50 border-2 border-blue-300 font-semibold'
                : 'bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div>{s.name}</div>
            {s.walkMin && <div className="text-xs text-slate-500 mt-1">🚶 {s.walkMin} min walk</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

export function NoticeBanner({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm">
      <div className="font-bold text-amber-800">{title}</div>
      <ul className="mt-1 space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-amber-700">• {it}</li>
        ))}
      </ul>
    </div>
  );
}
