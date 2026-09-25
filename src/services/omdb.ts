import { MovieDetails, MovieItem, SearchResponse, FilterType } from '../types';

const API_KEY = '3eed3bad';
const BASE_URL = 'https://www.omdbapi.com/';

export async function searchMovies(
  query: string,
  page: number = 1,
  type?: FilterType,
  year?: string
): Promise<SearchResponse> {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return { Response: 'False', Error: 'Please enter a movie title.' };
  }

  const params = new URLSearchParams({
    apikey: API_KEY,
    s: cleanQuery,
    page: page.toString(),
  });

  if (type && type !== 'all') {
    params.append('type', type);
  }

  if (year && year.trim()) {
    params.append('y', year.trim());
  }

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Network response error: ${res.status}`);
    }
    const data: SearchResponse = await res.json();
    return data;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch movies';
    return {
      Response: 'False',
      Error: msg,
    };
  }
}

export async function getMovieDetails(imdbID: string): Promise<MovieDetails | null> {
  const cleanId = imdbID.trim();
  if (!cleanId) return null;

  try {
    const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(cleanId)}&plot=full`);
    if (!res.ok) {
      throw new Error(`Network error: ${res.status}`);
    }
    const data: MovieDetails = await res.json();
    if (data.Response === 'True') {
      return data;
    }
    return null;
  } catch (err) {
    console.error('Error fetching movie details:', err);
    return null;
  }
}

export const CURATED_LISTS = {
  trending: ['tt15398776', 'tt1160419', 'tt0816692', 'tt1375666', 'tt0468569', 'tt9362722'], // Oppenheimer, Dune, Interstellar, Inception, Dark Knight, Spider-Man Across
  popularMovies: ['tt0111161', 'tt0068646', 'tt0109830', 'tt0137523', 'tt0120737', 'tt1517268'], // Shawshank, Godfather, Forrest Gump, Fight Club, LOTR, Barbie
  topSeries: ['tt0903747', 'tt0944947', 'tt4052886', 'tt0773262', 'tt1190634', 'tt2560140'], // Breaking Bad, Game of Thrones, Lucif/Stranger Things, Dexter, Boys, Attack on Titan
  actionBlockbusters: ['tt1877830', 'tt4154796', 'tt0133093', 'tt1745960', 'tt2934292'], // The Batman, Avengers Endgame, The Matrix, Top Gun Maverick, Mission Impossible
  sciFiCinema: ['tt1856101', 'tt2543164', 'tt0062622', 'tt0079221', 'tt1630029'], // Blade Runner 2049, Arrival, 2001, Alien, Avatar The Way of Water
};
