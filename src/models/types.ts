export interface Search<T> {
  currentPage?: number;
  hasNextPage?: boolean;
  totalPages?: number;
  totalResults?: number;
  results: T[]
}

export enum Type {
  TV = "tv",
  Movie = "movie",
}

export enum SubOrDub {
  SUB = "sub",
  DUB = "dub",
}

export interface LastAirDate {
  year: number;
  month: number;
  day: number;
}

export interface Result {
  // TODO: pages types
  id: string;
  title: string;
  type?: Type;
  score?: number;
  subOrDub?: SubOrDub;
  lastAirDate?: LastAirDate;
  seasonsCount?: number;
  cover?: string;
  coverMobile?: string;
  logo?: string;
  poster?: string;
  background?: string; // banner
}
