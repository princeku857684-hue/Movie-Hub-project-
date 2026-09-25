/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Film,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Flame,
  Tv,
  Star,
  Play,
  Bookmark,
  Info,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { MovieCard } from './components/MovieCard';
import { MovieDetailsView } from './components/MovieDetailsView';
import { WatchlistView } from './components/WatchlistView';
import {
  searchMovies,
  getMovieDetails,
  FALLBACK_HERO_MOVIE,
  FALLBACK_TRENDING,
  FALLBACK_POPULAR,
  FALLBACK_SERIES,
  FALLBACK_SCIFI,
} from './services/omdb';
import { MovieItem, MovieDetails, FilterType, SortOption } from './types';

const STORAGE_KEY_WATCHLIST = 'cineflux_watchlist_v1';

export default function App() {
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  });

  const [currentTab, setCurrentTab] = useState<'home' | 'movies' | 'tv' | 'watchlist' | 'search'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchTitle, setActiveSearchTitle] = useState('');
  const [searchResults, setSearchResults] = useState<MovieItem[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Curated Cineflux Rows Data
  const [heroMovie, setHeroMovie] = useState<MovieDetails | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<MovieItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MovieItem[]>([]);
  const [topSeries, setTopSeries] = useState<MovieItem[]>([]);
  const [sciFiMovies, setSciFiMovies] = useState<MovieItem[]>([]);
  const [loadingCurated, setLoadingCurated] = useState(true);

  // Watchlist persisted in localStorage
  const [watchlist, setWatchlist] = useState<MovieItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WATCHLIST);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WATCHLIST, JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist to localStorage', e);
    }
  }, [watchlist]);

  // Sync browser URL history
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      setSelectedMovieId(id);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openMovieDetails = (imdbID: string) => {
    setSelectedMovieId(imdbID);
    const newUrl = `${window.location.pathname}?id=${encodeURIComponent(imdbID)}`;
    window.history.pushState({ id: imdbID }, '', newUrl);
  };

  const closeMovieDetails = () => {
    setSelectedMovieId(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  // Fetch curated showcase on initial load (like Cine-flux)
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      setLoadingCurated(true);
      // Immediately set robust fallback datasets to prevent layout shifts or empty states
      setHeroMovie(FALLBACK_HERO_MOVIE);
      setTrendingMovies(FALLBACK_TRENDING);
      setPopularMovies(FALLBACK_POPULAR);
      setTopSeries(FALLBACK_SERIES);
      setSciFiMovies(FALLBACK_SCIFI);

      try {
        const hero = await getMovieDetails('tt15398776');
        if (hero && isMounted) {
          setHeroMovie(hero);
        }
      } catch (err) {
        console.warn('Using cached fallback catalog:', err);
      } finally {
        if (isMounted) setLoadingCurated(false);
      }
    }

    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Search logic
  const handlePerformSearch = useCallback(
    async (queryText: string, page = 1, type = filterType, year = yearFilter) => {
      const cleanQ = queryText.trim();
      if (!cleanQ) return;

      setIsSearching(true);
      setSearchError(null);
      setActiveSearchTitle(cleanQ);
      setCurrentPage(page);
      setCurrentTab('search');

      const res = await searchMovies(cleanQ, page, type, year);

      if (res.Response === 'True' && res.Search) {
        setSearchResults(res.Search);
        setTotalResults(parseInt(res.totalResults || '0', 10));
      } else {
        setSearchResults([]);
        setTotalResults(0);
        setSearchError(res.Error || 'No results found matching your search.');
      }

      setIsSearching(false);
    },
    [filterType, yearFilter]
  );

  // Watchlist toggle
  const handleToggleWatchlist = (movie: MovieItem) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.imdbID === movie.imdbID);
      if (exists) {
        return prev.filter((item) => item.imdbID !== movie.imdbID);
      } else {
        return [movie, ...prev];
      }
    });
  };

  const handleClearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      setWatchlist([]);
    }
  };

  // Sort searched movies
  const sortedSearchResults = useMemo(() => {
    const list = [...searchResults];
    if (sortBy === 'year-desc') {
      return list.sort((a, b) => (parseInt(b.Year, 10) || 0) - (parseInt(a.Year, 10) || 0));
    }
    if (sortBy === 'year-asc') {
      return list.sort((a, b) => (parseInt(a.Year, 10) || 0) - (parseInt(b.Year, 10) || 0));
    }
    if (sortBy === 'title-asc') {
      return list.sort((a, b) => a.Title.localeCompare(b.Title));
    }
    return list;
  }, [searchResults, sortBy]);

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* CineFlux Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (selectedMovieId) closeMovieDetails();
        }}
        watchlistCount={watchlist.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={(q) => handlePerformSearch(q, 1)}
      />

      <main className="flex-1">
        {/* Detail View modal/page */}
        {selectedMovieId ? (
          <MovieDetailsView
            imdbID={selectedMovieId}
            onBack={closeMovieDetails}
            isSavedToWatchlist={watchlist.some((m) => m.imdbID === selectedMovieId)}
            onToggleWatchlist={handleToggleWatchlist}
          />
        ) : currentTab === 'watchlist' ? (
          /* Watchlist View */
          <WatchlistView
            watchlist={watchlist}
            onSelectMovie={openMovieDetails}
            onToggleWatchlist={handleToggleWatchlist}
            onClearWatchlist={handleClearWatchlist}
            onExplore={() => setCurrentTab('home')}
          />
        ) : currentTab === 'search' ? (
          /* Search Results Screen */
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <SearchBar
                query={searchQuery}
                setQuery={setSearchQuery}
                onSearch={(q, t, y) => handlePerformSearch(q, 1, t, y)}
                isLoading={isSearching}
                filterType={filterType}
                setFilterType={setFilterType}
                year={yearFilter}
                setYear={setYearFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Results for <span className="text-amber-400">"{activeSearchTitle}"</span>
                </h2>
                {totalResults > 0 && (
                  <p className="text-xs text-neutral-400 mt-1">
                    Found {totalResults.toLocaleString()} titles
                  </p>
                )}
              </div>

              {totalPages > 1 && (
                <div className="text-xs text-neutral-400 font-mono">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>

            {/* Loading */}
            {isSearching && (
              <div className="py-24 text-center">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-3 border-amber-500/20 border-t-amber-400" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Searching CineFlux Catalog...
                </p>
              </div>
            )}

            {/* Error / Empty */}
            {!isSearching && searchError && (
              <div className="my-16 mx-auto max-w-md rounded-2xl border border-white/5 bg-neutral-900/60 p-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-950/40 text-red-400 border border-red-900/50">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">No Results Found</h3>
                <p className="mt-1 text-xs text-neutral-400">{searchError}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('Inception');
                    handlePerformSearch('Inception', 1);
                  }}
                  className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors"
                >
                  Search "Inception"
                </button>
              </div>
            )}

            {/* Results Grid */}
            {!isSearching && !searchError && sortedSearchResults.length > 0 && (
              <div
                id="movieHub"
                className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
              >
                {sortedSearchResults.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    onSelectMovie={openMovieDetails}
                    isSavedToWatchlist={watchlist.some((m) => m.imdbID === movie.imdbID)}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isSearching && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handlePerformSearch(activeSearchTitle, currentPage - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1 rounded-xl border border-white/10 bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <span className="text-xs text-neutral-400 font-mono">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    handlePerformSearch(activeSearchTitle, currentPage + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1 rounded-xl border border-white/10 bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Home / Movies / Series Tab (Cine-flux Streaming Hero + Curated Rows) */
          <div>
            {/* Hero Showcase (like Cine-flux featured banner) */}
            {heroMovie && (
              <div className="relative min-h-[500px] sm:min-h-[580px] w-full overflow-hidden border-b border-white/5 bg-neutral-950 flex items-center">
                {/* Background Ambient Poster Art */}
                <div className="absolute inset-0 z-0">
                  {heroMovie.Poster && heroMovie.Poster !== 'N/A' && (
                    <img
                      src={heroMovie.Poster}
                      alt={heroMovie.Title}
                      className="h-full w-full object-cover object-top opacity-30 filter blur-sm scale-110"
                    />
                  )}
                  {/* Cineflux gradient masks */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
                  <div className="max-w-2xl space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md">
                      <Flame className="h-3.5 w-3.5 fill-current" />
                      <span>FEATURED SPOTLIGHT</span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
                      {heroMovie.Title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-neutral-300">
                      <div className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{heroMovie.imdbRating} / 10</span>
                      </div>
                      <span className="text-neutral-600">·</span>
                      <span>{heroMovie.Year}</span>
                      <span className="text-neutral-600">·</span>
                      <span className="border border-white/15 px-1.5 py-0.5 rounded text-[11px]">
                        {heroMovie.Rated}
                      </span>
                      <span className="text-neutral-600">·</span>
                      <span>{heroMovie.Runtime}</span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-amber-300">{heroMovie.Genre}</span>
                    </div>

                    <p className="line-clamp-3 text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl">
                      {heroMovie.Plot}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => openMovieDetails(heroMovie.imdbID)}
                        className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3 text-sm font-bold text-neutral-950 shadow-lg shadow-amber-500/25 transition-all"
                      >
                        <Info className="h-4 w-4" />
                        <span>View Details</span>
                      </button>

                      <button
                        onClick={() => handleToggleWatchlist(heroMovie)}
                        className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all ${
                          watchlist.some((m) => m.imdbID === heroMovie.imdbID)
                            ? 'border-amber-500/40 bg-amber-500/20 text-amber-300'
                            : 'border-white/10 bg-neutral-900/80 text-white hover:bg-neutral-800'
                        }`}
                      >
                        <Bookmark className="h-4 w-4" />
                        <span>
                          {watchlist.some((m) => m.imdbID === heroMovie.imdbID)
                            ? 'In Watchlist'
                            : 'Add to Watchlist'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Search Banner */}
            <div className="border-b border-white/5 bg-neutral-900/40 py-6 px-4">
              <div className="mx-auto max-w-4xl text-center">
                <SearchBar
                  query={searchQuery}
                  setQuery={setSearchQuery}
                  onSearch={(q, t, y) => handlePerformSearch(q, 1, t, y)}
                  isLoading={isSearching}
                  filterType={filterType}
                  setFilterType={setFilterType}
                  year={yearFilter}
                  setYear={setYearFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              </div>
            </div>

            {/* Curated Content Rows (CineFlux Netflix/TMDB style) */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
              {/* Row 1: Trending Now */}
              {(currentTab === 'home' || currentTab === 'movies') && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                        <Flame className="h-4 w-4" />
                      </div>
                      <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                        Trending Now
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('Top Movies');
                        handlePerformSearch('Star Wars', 1);
                      }}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300"
                    >
                      See All →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {trendingMovies.map((movie) => (
                      <MovieCard
                        key={movie.imdbID}
                        movie={movie}
                        onSelectMovie={openMovieDetails}
                        isSavedToWatchlist={watchlist.some((m) => m.imdbID === movie.imdbID)}
                        onToggleWatchlist={handleToggleWatchlist}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Row 2: All Time Acclaimed */}
              {(currentTab === 'home' || currentTab === 'movies') && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                        <Star className="h-4 w-4" />
                      </div>
                      <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                        Critically Acclaimed Masterpieces
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {popularMovies.map((movie) => (
                      <MovieCard
                        key={movie.imdbID}
                        movie={movie}
                        onSelectMovie={openMovieDetails}
                        isSavedToWatchlist={watchlist.some((m) => m.imdbID === movie.imdbID)}
                        onToggleWatchlist={handleToggleWatchlist}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Row 3: Binge-worthy TV Series */}
              {(currentTab === 'home' || currentTab === 'tv') && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                        <Tv className="h-4 w-4" />
                      </div>
                      <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                        Top Rated Television Series
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {topSeries.map((series) => (
                      <MovieCard
                        key={series.imdbID}
                        movie={series}
                        onSelectMovie={openMovieDetails}
                        isSavedToWatchlist={watchlist.some((m) => m.imdbID === series.imdbID)}
                        onToggleWatchlist={handleToggleWatchlist}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Row 4: Sci-Fi & Mind Bending */}
              {currentTab === 'home' && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                        Sci-Fi & Mind-Benders
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {sciFiMovies.map((movie) => (
                      <MovieCard
                        key={movie.imdbID}
                        movie={movie}
                        onSelectMovie={openMovieDetails}
                        isSavedToWatchlist={watchlist.some((m) => m.imdbID === movie.imdbID)}
                        onToggleWatchlist={handleToggleWatchlist}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </main>

      {/* CineFlux Footer */}
      <footer className="border-t border-white/5 bg-neutral-950 py-10 text-neutral-400 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-neutral-950 font-black text-xs">
              CF
            </div>
            <span className="font-display font-bold text-white text-sm">CINEFLUX</span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-500">Film & Television Catalog</span>
          </div>

          <div className="flex items-center gap-6 text-neutral-500">
            <span>OMDb Engine</span>
            <span>Real-time Search</span>
            <span>Modern Tailwind UI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
