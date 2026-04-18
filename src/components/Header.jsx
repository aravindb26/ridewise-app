import React from 'react';

export default function Header() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-black">R</div>
        <span className="text-lg font-bold tracking-tight">RideWise</span>
      </div>
    </nav>
  );
}
