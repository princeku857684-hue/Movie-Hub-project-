import React, { useState } from 'react';
import {
  Film,
  Search,
  Bookmark,
  Tv,
  Sparkles,
  TrendingUp,
  X,
  Compass,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'movies' | 'tv' | 'watchlist' | 'search';
  setCurrentTab: (tab: 'home' | 'movies' | 'tv' | 'watchlist' | 'search') => void;
  watchlistCount: number;
  onSearchSubmit: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  watchlistCount,
  onSearchSubmit,
  searchQuery,
  setSearchQuery,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setCurrentTab('search');
    onSearchSubmit(searchQuery.trim());
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-neutral-950/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - CineFlux Style */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setCurrentTab('home')}
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-neutral-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Film className="h-5 w-5" />
            </div>
            <div className="flex items-baseline font-display text-xl font-extrabold tracking-tight">
              <span className="text-white">CINE</span>
              <span className="text-amber-400">FLUX</span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-neutral-400">
            <button
              onClick={() => setCurrentTab('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                currentTab === 'home'
                  ? 'text-white bg-white/10 font-semibold'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="h-4 w-4 text-amber-400" />
              <span>Explore</span>
            </button>

            <button
              onClick={() => setCurrentTab('movies')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                currentTab === 'movies'
                  ? 'text-white bg-white/10 font-semibold'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="h-4 w-4 text-amber-400" />
              <span>Movies</span>
            </button>

            <button
              onClick={() => setCurrentTab('tv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                currentTab === 'tv'
                  ? 'text-white bg-white/10 font-semibold'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Tv className="h-4 w-4 text-amber-400" />
              <span>Series</span>
            </button>

            <button
              onClick={() => setCurrentTab('watchlist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                currentTab === 'watchlist'
                  ? 'text-white bg-white/10 font-semibold'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Bookmark className="h-4 w-4 text-amber-400" />
              <span>Watchlist</span>
              {watchlistCount > 0 && (
                <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[11px] font-semibold text-amber-300 tabular-nums">
                  {watchlistCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Right side: Search form */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSubmit} className="relative hidden sm:block w-64 lg:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, TV shows, cast..."
              className="w-full rounded-full border border-white/10 bg-neutral-900/90 py-1.5 pl-10 pr-9 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-400 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            <Search className="pointer-events-none absolute left-3.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          {/* Mobile search trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="sm:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-neutral-900 text-neutral-300 hover:text-white"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            onClick={() => setCurrentTab('watchlist')}
            className="md:hidden relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-neutral-900 text-neutral-300"
          >
            <Bookmark className="h-4 w-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-neutral-950">
                {watchlistCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search input expand */}
      {searchOpen && (
        <div className="sm:hidden border-t border-white/5 bg-neutral-950 px-4 py-3">
          <form onSubmit={handleSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, TV shows, cast..."
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-neutral-900 py-2 pl-10 pr-10 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
            />
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
            <button
              type="submit"
              className="absolute right-2.5 top-2 bg-amber-500 text-neutral-950 px-2.5 py-1 rounded-md text-xs font-semibold"
            >
              Go
            </button>
          </form>
        </div>
      )}
      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-white/5 bg-neutral-950/95 py-2 px-3 text-xs">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg ${
            currentTab === 'home' ? 'text-amber-400 font-bold' : 'text-neutral-400'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>Explore</span>
        </button>
        <button
          onClick={() => setCurrentTab('movies')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg ${
            currentTab === 'movies' ? 'text-amber-400 font-bold' : 'text-neutral-400'
          }`}
        >
          <Film className="h-4 w-4" />
          <span>Movies</span>
        </button>
        <button
          onClick={() => setCurrentTab('tv')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg ${
            currentTab === 'tv' ? 'text-amber-400 font-bold' : 'text-neutral-400'
          }`}
        >
          <Tv className="h-4 w-4" />
          <span>Series</span>
        </button>
        <button
          onClick={() => setCurrentTab('watchlist')}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg ${
            currentTab === 'watchlist' ? 'text-amber-400 font-bold' : 'text-neutral-400'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span>Watchlist</span>
          {watchlistCount > 0 && (
            <span className="absolute -top-1 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-neutral-950">
              {watchlistCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
