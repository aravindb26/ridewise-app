import React from 'react';

const Header = () => {
  return (
    <header className="bg-white border-b border-neutral-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">📍</div>
            <h1 className="text-xl font-bold text-neutral-text-primary">
              RideWise
            </h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-neutral-text-secondary hover:text-primary"
            >
              How it Works
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-neutral-text-secondary hover:text-primary"
            >
              FAQ
            </a>
          </nav>
          <button className="md:hidden">
            <svg
              className="w-6 h-6 text-neutral-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
