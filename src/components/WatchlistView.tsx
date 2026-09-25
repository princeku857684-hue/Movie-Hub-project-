import React from 'react';
import { Bookmark, Film, Trash2, ArrowLeft, Clapperboard } from 'lucide-react';
import { MovieItem } from '../types';
import { MovieCard } from './MovieCard';

interface WatchlistViewProps {
  watchlist: MovieItem[];
  onSelectMovie: (imdbID: string) => void;
  onToggleWatchlist: (movie: MovieItem) => void;
  onClearWatchlist: () => void;
  onExplore: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  watchlist,
  onSelectMovie,
  onToggleWatchlist,
  onClearWatchlist,
  onExplore,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <button
            onClick={onExplore}
            className="mb-3 inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Explorer</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bookmark className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                My Watchlist
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400">
                {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved to your personal library
              </p>
            </div>
          </div>
        </div>

        {watchlist.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={onClearWatchlist}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-2 text-xs font-semibold text-neutral-400 hover:border-red-900/50 hover:bg-red-950/20 hover:text-red-300 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Watchlist</span>
            </button>
            <button
              onClick={onExplore}
              className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors"
            >
              Browse More
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {watchlist.length === 0 ? (
        <div className="py-24 text-center max-w-md mx-auto">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-neutral-500 border border-white/5">
            <Clapperboard className="h-8 w-8 text-neutral-600" />
          </div>
          <h3 className="font-display text-lg font-bold text-neutral-200">
            Your Watchlist is empty
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Click the bookmark icon on any movie or TV series card to save it to your personal watchlist collection.
          </p>
          <button
            onClick={onExplore}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            Explore Cinema Catalog
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onSelectMovie={onSelectMovie}
              isSavedToWatchlist={true}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};
