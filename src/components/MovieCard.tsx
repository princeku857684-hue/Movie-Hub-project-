import React, { useState } from 'react';
import { Bookmark, Star, ArrowUpRight, Film, Calendar } from 'lucide-react';
import { MovieItem } from '../types';

interface MovieCardProps {
  movie: MovieItem;
  onSelectMovie: (imdbID: string) => void;
  isSavedToWatchlist: boolean;
  onToggleWatchlist: (movie: MovieItem) => void;
  rating?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  isSavedToWatchlist,
  onToggleWatchlist,
  rating,
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const hasValidPoster = movie.Poster && movie.Poster !== 'N/A' && !imgError;

  return (
    <div
      onClick={() => onSelectMovie(movie.imdbID)}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-neutral-900/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer text-left"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-950">
        {hasValidPoster ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-neutral-800" />
            )}
            <img
              src={movie.Poster}
              alt={movie.Title}
              referrerPolicy="no-referrer"
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-neutral-400">
            <Film className="h-8 w-8 text-neutral-600 mb-2" />
            <p className="line-clamp-2 text-xs font-semibold text-neutral-300">
              {movie.Title}
            </p>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
          {movie.Type && (
            <span className="rounded-md bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300 border border-white/10">
              {movie.Type}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(movie);
            }}
            title={isSavedToWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            className={`pointer-events-auto ml-auto flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 ${
              isSavedToWatchlist
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/40'
                : 'bg-neutral-950/70 text-neutral-300 hover:bg-neutral-900 hover:text-white border border-white/10'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isSavedToWatchlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 pointer-events-none">
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-300">
            <span>Explore</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Info Details */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div>
          <h3
            className="font-display font-semibold text-sm text-neutral-100 line-clamp-1 group-hover:text-amber-300 transition-colors"
            title={movie.Title}
          >
            {movie.Title}
          </h3>

          <div className="mt-1 flex items-center justify-between text-xs text-neutral-400">
            <span className="tabular-nums text-neutral-400 font-medium">{movie.Year}</span>
            {rating && rating !== 'N/A' && (
              <div className="flex items-center gap-1 text-amber-400 text-xs font-medium font-mono">
                <Star className="h-3 w-3 fill-current" />
                <span>{rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
