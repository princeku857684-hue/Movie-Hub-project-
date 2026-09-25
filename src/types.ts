export interface MovieItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: 'movie' | 'series' | 'episode' | string;
  Poster: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

export interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings?: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string;
  Error?: string;
}

export interface SearchResponse {
  Search?: MovieItem[];
  totalResults?: string;
  Response: 'True' | 'False';
  Error?: string;
}

export type FilterType = 'all' | 'movie' | 'series' | 'episode';

export type SortOption = 'default' | 'year-desc' | 'year-asc' | 'title-asc';
