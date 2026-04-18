import React from 'react';

export function NoticeBanner({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm">
      <p className="font-bold text-amber-800">{title}</p>
      <ul className="mt-1 space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="text-amber-700">• {item}</li>
        ))}
      </ul>
    </div>
  );
}
