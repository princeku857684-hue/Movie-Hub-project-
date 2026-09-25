import { MovieDetails, MovieItem, SearchResponse, FilterType } from '../types';

const API_KEY = '3eed3bad';
const BASE_URL = 'https://www.omdbapi.com/';

// In-memory cache to prevent redundant network requests and avoid OMDb rate limits
const movieDetailsCache = new Map<string, MovieDetails>();
const searchCache = new Map<string, SearchResponse>();

// High-reliability offline/instant fallback data for showcase hero & curated lists
export const FALLBACK_HERO_MOVIE: MovieDetails = {
  Title: 'Oppenheimer',
  Year: '2023',
  Rated: 'R',
  Released: '21 Jul 2023',
  Runtime: '180 min',
  Genre: 'Biography, Drama, History',
  Director: 'Christopher Nolan',
  Writer: 'Christopher Nolan, Kai Bird, Martin Sherwin',
  Actors: 'Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.',
  Plot: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, confronting moral and existential consequences.',
  Language: 'English, German, Italian',
  Country: 'United States, United Kingdom',
  Awards: 'Won 7 Oscars. 392 wins & 406 nominations total',
  Poster: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg',
  Ratings: [
    { Source: 'Internet Movie Database', Value: '8.9/10' },
    { Source: 'Rotten Tomatoes', Value: '93%' },
    { Source: 'Metacritic', Value: '88/100' }
  ],
  Metascore: '88',
  imdbRating: '8.9',
  imdbVotes: '820,400',
  imdbID: 'tt15398776',
  Type: 'movie',
  BoxOffice: '$957,842,430',
  Response: 'True'
};

export const FALLBACK_TRENDING: MovieItem[] = [
  {
    Title: 'Oppenheimer',
    Year: '2023',
    imdbID: 'tt15398776',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg'
  },
  {
    Title: 'Dune: Part Two',
    Year: '2024',
    imdbID: 'tt15239678',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg'
  },
  {
    Title: 'Interstellar',
    Year: '2014',
    imdbID: 'tt0816692',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg'
  },
  {
    Title: 'Inception',
    Year: '2010',
    imdbID: 'tt1375666',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg'
  },
  {
    Title: 'The Dark Knight',
    Year: '2008',
    imdbID: 'tt0468569',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg'
  },
  {
    Title: 'Spider-Man: Across the Spider-Verse',
    Year: '2023',
    imdbID: 'tt9362722',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmEtMzU4MDQxYTMzMjU2XkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg'
  }
];

export const FALLBACK_POPULAR: MovieItem[] = [
  {
    Title: 'The Shawshank Redemption',
    Year: '1994',
    imdbID: 'tt0111161',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxNzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg'
  },
  {
    Title: 'The Godfather',
    Year: '1972',
    imdbID: 'tt0068646',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg'
  },
  {
    Title: 'Fight Club',
    Year: '1999',
    imdbID: 'tt0137523',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg'
  },
  {
    Title: 'Forrest Gump',
    Year: '1994',
    imdbID: 'tt0109830',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'
  },
  {
    Title: 'The Matrix',
    Year: '1999',
    imdbID: 'tt0133093',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg'
  },
  {
    Title: 'Barbie',
    Year: '2023',
    imdbID: 'tt1517268',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljZDBlODg4XkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_SX300.jpg'
  }
];

export const FALLBACK_SERIES: MovieItem[] = [
  {
    Title: 'Breaking Bad',
    Year: '2008–2013',
    imdbID: 'tt0903747',
    Type: 'series',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjAtNjA5cf070624a04dXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg'
  },
  {
    Title: 'Game of Thrones',
    Year: '2011–2019',
    imdbID: 'tt0944947',
    Type: 'series',
    Poster: 'https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMi00NDhkLTkzZjQtN2ZlOTVhYmVlOGVmL2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg'
  },
  {
    Title: 'Stranger Things',
    Year: '2016–2025',
    imdbID: 'tt4574334',
    Type: 'series',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3YTgtZTZlN2RmZTk2ZDY4XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg'
  },
  {
    Title: 'The Boys',
    Year: '2019–',
    imdbID: 'tt1190634',
    Type: 'series',
    Poster: 'https://m.media-amazon.com/images/M/MV5BODU0M2IyMmMtYzE2Yi00NmY0LWEyYmQtY2M4YTM3ZGM5Zjg4XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg'
  },
  {
    Title: 'Chernobyl',
    Year: '2019',
    imdbID: 'tt7366338',
    Type: 'series',
    Poster: 'https://m.media-amazon.com/images/M/MV5BZGQ2YmMxZmEtYjI5OS00NzlkLTlkNWEtYWExZTkxNTFhNWExXkEyXkFqcGdeQXVyNzQ1ODk3MTQ@._V1_SX300.jpg'
  },
  {
    Title: 'Succession',
    Year: '2018–2023',
    imdbID: 'tt7660850',
    Type: 'series',
    Poster: 'https://m.media-amazon.com/images/M/MV5BZDg5MTQ2MjUtM2Y2OC00MDc5LWI1ZjEtOGY1YjM4MWMyNmRlXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg'
  }
];

export const FALLBACK_SCIFI: MovieItem[] = [
  {
    Title: 'Blade Runner 2049',
    Year: '2017',
    imdbID: 'tt1856101',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_SX300.jpg'
  },
  {
    Title: 'Arrival',
    Year: '2016',
    imdbID: 'tt2543164',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMTExMzU0ODcxNDheQTJeQWpwZ15BbWU4MDE1OTI4MzAy._V1_SX300.jpg'
  },
  {
    Title: 'The Matrix Resurrections',
    Year: '2021',
    imdbID: 'tt10838180',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMGJkNDJlZWUtOGM1Ny00NzcwLTlhYmQtYTQzZGYwMWVlNzg3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg'
  },
  {
    Title: 'Avatar: The Way of Water',
    Year: '2022',
    imdbID: 'tt1630029',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFiNzAtNTVhNzM1YjlyMGVkXkEyXkFqcGdeQXVyCADQ0NDQ5OA@@._V1_SX300.jpg'
  },
  {
    Title: '2001: A Space Odyssey',
    Year: '1968',
    imdbID: 'tt0062622',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMmNlYzRiNDctZWNhMi00MzI4LThkZTctMTUzMmZkMmFmNThmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg'
  }
];

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

  const cacheKey = `${cleanQuery.toLowerCase()}_${page}_${type || 'all'}_${year || ''}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
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
      throw new Error(`OMDb server responded with HTTP status ${res.status}`);
    }
    const data: SearchResponse = await res.json();
    if (data.Response === 'True') {
      searchCache.set(cacheKey, data);
    }
    return data;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error connecting to OMDb';
    return {
      Response: 'False',
      Error: msg,
    };
  }
}

export async function getMovieDetails(imdbID: string): Promise<MovieDetails | null> {
  const cleanId = imdbID.trim();
  if (!cleanId) return null;

  if (movieDetailsCache.has(cleanId)) {
    return movieDetailsCache.get(cleanId)!;
  }

  // Pre-check for Oppenheimer fallback
  if (cleanId === 'tt15398776') {
    movieDetailsCache.set(cleanId, FALLBACK_HERO_MOVIE);
  }

  try {
    const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(cleanId)}&plot=full`);
    if (!res.ok) {
      throw new Error(`Network error: ${res.status}`);
    }
    const data: MovieDetails = await res.json();
    if (data && data.Response === 'True') {
      movieDetailsCache.set(cleanId, data);
      return data;
    }
    // If API limit or key issue occurs, check fallback
    if (cleanId === 'tt15398776') {
      return FALLBACK_HERO_MOVIE;
    }
    return null;
  } catch (err) {
    console.warn(`Could not load details for ${cleanId}:`, err);
    if (cleanId === 'tt15398776') {
      return FALLBACK_HERO_MOVIE;
    }
    return null;
  }
}
