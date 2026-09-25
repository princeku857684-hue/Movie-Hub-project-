import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, Calendar, Film, Sparkles } from 'lucide-react';
import { FilterType, SortOption } from '../types';

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  onSearch: (q: string, type?: FilterType, year?: string) => void;
  isLoading: boolean;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  year: string;
  setYear: (y: string) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
}

const POPULAR_SUGGESTIONS = [
  'Oppenheimer',
  'Interstellar',
  'Dune',
  'The Dark Knight',
  'Inception',
  'Blade Runner 2049',
  'Breaking Bad',
  'Stranger Things',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  onSearch,
  isLoading,
  filterType,
  setFilterType,
  year,
  setYear,
  sortBy,
  setSortBy,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim(), filterType, year);
  };

  const handleSuggestionClick = (title: string) => {
    setQuery(title);
    onSearch(title, filterType, year);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Primary Search Form */}
      <form
        id="movieForm"
        onSubmit={handleSubmit}
        className="relative flex flex-col sm:flex-row gap-2"
      >
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
            <Search className="h-5 w-5" />
          </div>

          <input
            id="movieInput"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movie title, series (e.g. Inception, Dune)..."
            className="w-full rounded-2xl border border-white/10 bg-neutral-900/90 py-3.5 pl-12 pr-11 text-sm sm:text-base text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all ${
              showFilters || year || filterType !== 'all'
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                : 'border-white/10 bg-neutral-900/80 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3.5 text-sm sm:text-base font-bold text-neutral-950 transition-all hover:opacity-95 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-amber-500/20"
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Advanced Filters Expandable Drawer */}
      {showFilters && (
        <div className="rounded-2xl border border-white/10 bg-neutral-900/90 p-4 shadow-xl backdrop-blur-md grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <div className="flex rounded-xl bg-neutral-950 p-1 border border-white/5 text-xs">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'movie', label: 'Movies' },
                  { id: 'series', label: 'Series' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setFilterType(tab.id);
                    if (query.trim()) onSearch(query, tab.id, year);
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
                    filterType === tab.id
                      ? 'bg-neutral-800 text-amber-300 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
              Release Year
            </label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                type="number"
                placeholder="e.g. 2024"
                min="1900"
                max="2030"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (query.trim()) onSearch(query, filterType, year);
                  }
                }}
                className="w-full rounded-xl border border-white/10 bg-neutral-950 py-1.5 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full rounded-xl border border-white/10 bg-neutral-950 py-1.5 px-3 text-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              <option value="default">Popular / Relevance</option>
              <option value="year-desc">Year (Newest First)</option>
              <option value="year-asc">Year (Oldest First)</option>
              <option value="title-asc">Title (A to Z)</option>
            </select>
          </div>
        </div>
      )}

      {/* Popular Quick Suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs text-neutral-400">
        <span className="text-neutral-500 font-medium mr-1">Trending searches:</span>
        {POPULAR_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestionClick(suggestion)}
            className="rounded-full border border-white/5 bg-neutral-900/60 px-2.5 py-1 text-neutral-300 hover:border-amber-500/30 hover:bg-neutral-800 hover:text-amber-300 transition-all text-xs"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
