import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  Bookmark,
  ExternalLink,
  Share2,
  Clock,
  Calendar,
  Award,
  Film,
  Check,
  Globe2,
  DollarSign,
  Play,
  Users,
  Clapperboard,
} from 'lucide-react';
import { MovieDetails, MovieItem } from '../types';
import { getMovieDetails } from '../services/omdb';

interface MovieDetailsViewProps {
  imdbID: string;
  onBack: () => void;
  isSavedToWatchlist: boolean;
  onToggleWatchlist: (movie: MovieItem) => void;
}

export const MovieDetailsView: React.FC<MovieDetailsViewProps> = ({
  imdbID,
  onBack,
  isSavedToWatchlist,
  onToggleWatchlist,
}) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function load() {
      setLoading(true);
      setError(null);
      const data = await getMovieDetails(imdbID);
      if (!isMounted) return;
      if (data && data.Response === 'True') {
        setMovie(data);
      } else {
        setError(data?.Error || 'Unable to load details.');
      }
      setLoading(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [imdbID]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-pulse">
          <div className="md:col-span-4 aspect-[2/3] rounded-2xl bg-neutral-900 border border-white/5" />
          <div className="md:col-span-8 space-y-4">
            <div className="h-10 w-2/3 rounded-lg bg-neutral-900" />
            <div className="h-5 w-1/3 rounded bg-neutral-900" />
            <div className="h-32 w-full rounded-xl bg-neutral-900" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 rounded-xl bg-neutral-900" />
              <div className="h-20 rounded-xl bg-neutral-900" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-950/40 text-red-400 border border-red-900/50">
          <Film className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Movie Not Found</h2>
        <p className="mt-2 text-sm text-neutral-400">{error || 'Could not find details for this title.'}</p>
        <button
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>
    );
  }

  const hasPoster = movie.Poster && movie.Poster !== 'N/A' && !imgError;
  const movieItem: MovieItem = {
    Title: movie.Title,
    Year: movie.Year,
    imdbID: movie.imdbID,
    Type: movie.Type,
    Poster: movie.Poster,
  };

  return (
    <div id="movie-detail" className="relative min-h-screen pb-20">
      {/* Cinematic Ambient Backdrop Blur */}
      {hasPoster && (
        <div className="absolute top-0 left-0 right-0 h-96 overflow-hidden pointer-events-none opacity-20 filter blur-3xl z-0">
          <img src={movie.Poster} alt="" className="w-full h-full object-cover scale-150" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/80 to-neutral-950" />
        </div>
      )}

      {/* Header bar */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-neutral-900/80 backdrop-blur-md px-4 py-2 text-xs sm:text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-neutral-900/80 backdrop-blur-md px-3.5 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-neutral-400" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Poster & Quick Info */}
          <div className="md:col-span-4 lg:col-span-4 space-y-4">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl">
              {hasPoster ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-neutral-900">
                  <Film className="h-16 w-16 text-neutral-600 mb-3" />
                  <p className="font-semibold text-neutral-300">{movie.Title}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-3 text-sm font-bold text-neutral-950 shadow-lg shadow-amber-500/20 transition-all text-center"
              >
                <span>View on IMDb</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={() => onToggleWatchlist(movieItem)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                  isSavedToWatchlist
                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                    : 'border-white/10 bg-neutral-900/80 text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isSavedToWatchlist ? 'fill-current' : ''}`} />
                <span>{isSavedToWatchlist ? 'Saved in Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>

            {/* Ratings Grid */}
            <div className="rounded-2xl border border-white/5 bg-neutral-900/70 backdrop-blur-md p-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Ratings & Score
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-neutral-950/70 p-3 border border-white/5">
                  <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-xs font-semibold">IMDb</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    {movie.imdbRating !== 'N/A' ? movie.imdbRating : '—'}
                    <span className="text-xs text-neutral-500 font-normal"> / 10</span>
                  </div>
                  {movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
                    <div className="text-[11px] text-neutral-500 mt-0.5">{movie.imdbVotes} votes</div>
                  )}
                </div>

                <div className="rounded-xl bg-neutral-950/70 p-3 border border-white/5">
                  <div className="text-xs font-semibold text-neutral-400 mb-1">Metascore</div>
                  <div className="text-xl font-bold font-mono text-white">
                    {movie.Metascore !== 'N/A' ? movie.Metascore : '—'}
                    <span className="text-xs text-neutral-500 font-normal"> / 100</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Critic Score</div>
                </div>
              </div>

              {movie.Ratings && movie.Ratings.length > 0 && (
                <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs">
                  {movie.Ratings.map((r, i) => (
                    <div key={i} className="flex justify-between text-neutral-400">
                      <span className="truncate pr-2">{r.Source}</span>
                      <span className="font-mono text-neutral-200 font-semibold">{r.Value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Info & Overview */}
          <div className="md:col-span-8 lg:col-span-8 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-md bg-amber-500/20 text-amber-300 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
                  {movie.Type || 'Movie'}
                </span>
                {movie.Rated && movie.Rated !== 'N/A' && (
                  <span className="rounded-md bg-white/5 text-neutral-300 px-2 py-0.5 text-xs font-medium border border-white/10">
                    {movie.Rated}
                  </span>
                )}
                {movie.Runtime && movie.Runtime !== 'N/A' && (
                  <span className="flex items-center gap-1 text-neutral-400 text-xs font-medium">
                    <Clock className="h-3.5 w-3.5 text-neutral-500" />
                    <span>{movie.Runtime}</span>
                  </span>
                )}
                {movie.Released && movie.Released !== 'N/A' && (
                  <span className="flex items-center gap-1 text-neutral-400 text-xs font-medium">
                    <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                    <span>{movie.Released}</span>
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                {movie.Title}
              </h1>

              {movie.Genre && movie.Genre !== 'N/A' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {movie.Genre.split(',').map((g) => (
                    <span
                      key={g.trim()}
                      className="rounded-full bg-neutral-900 border border-white/10 px-3 py-1 text-xs font-medium text-neutral-300"
                    >
                      {g.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Plot */}
            <div className="rounded-2xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                Plot Overview
              </h3>
              <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
                {movie.Plot && movie.Plot !== 'N/A'
                  ? movie.Plot
                  : 'No detailed plot summary is available.'}
              </p>
            </div>

            {/* Crew & Cast */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/5 bg-neutral-900/40 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wide mb-1">
                  <Clapperboard className="h-3.5 w-3.5 text-amber-400" />
                  <span>Director</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  {movie.Director && movie.Director !== 'N/A' ? movie.Director : 'Not listed'}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-neutral-900/40 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wide mb-1">
                  <Film className="h-3.5 w-3.5 text-amber-400" />
                  <span>Writer</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  {movie.Writer && movie.Writer !== 'N/A' ? movie.Writer : 'Not listed'}
                </p>
              </div>
            </div>

            {/* Starring Actors */}
            <div className="rounded-xl border border-white/5 bg-neutral-900/40 p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wide mb-1.5">
                <Users className="h-3.5 w-3.5 text-amber-400" />
                <span>Starring Cast</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-neutral-200">
                {movie.Actors && movie.Actors !== 'N/A' ? movie.Actors : 'Not listed'}
              </p>
            </div>

            {/* Additional Production Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/5 bg-neutral-900/30 p-3.5">
                <span className="text-[11px] text-neutral-500 uppercase font-semibold">Language</span>
                <p className="text-xs font-medium text-neutral-200 mt-0.5">
                  {movie.Language && movie.Language !== 'N/A' ? movie.Language : 'English'}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-neutral-900/30 p-3.5">
                <span className="text-[11px] text-neutral-500 uppercase font-semibold">Country</span>
                <p className="text-xs font-medium text-neutral-200 mt-0.5">
                  {movie.Country && movie.Country !== 'N/A' ? movie.Country : 'Global'}
                </p>
              </div>

              {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                <div className="rounded-xl border border-white/5 bg-neutral-900/30 p-3.5">
                  <span className="text-[11px] text-neutral-500 uppercase font-semibold">Box Office</span>
                  <p className="text-xs font-semibold text-emerald-400 font-mono mt-0.5">
                    {movie.BoxOffice}
                  </p>
                </div>
              )}
            </div>

            {/* Awards section */}
            {movie.Awards && movie.Awards !== 'N/A' && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <Award className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Awards & Accolades
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-300 font-medium mt-0.5">
                    {movie.Awards}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
