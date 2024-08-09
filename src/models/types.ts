/* TODO: maybe custom types/enums:
  Result.type
  ShowInfo.quality
  ShowInfo.preview
*/

/* TODO: types not tested:
  ShowInfo.runtime
*/

export interface Search<T> {
  currentPage?: number;
  hasNextPage?: boolean;
  totalPages?: number;
  totalResults?: number;
  results: T[];
}

export enum SubOrDub {
  SUB = "sub",
  DUB = "dub",
}

export interface Date {
  year: number;
  month: number;
  day: number;
}

export interface Images {
  cover?: string;
  coverMobile?: string;
  logo?: string;
  poster?: string;
  background?: string; // banner
}

export interface Season {
  id: number;
  number: number;
  title?: string;
  plot?: string;
  releaseDate?: Date;
  episodesCount?: number;
}

export interface Result {
  id: string;
  title: string;
  type?: string;
  score?: number;
  subOrDub?: SubOrDub;
  lastAirDate?: Date;
  seasonsCount?: number;
  images?: Images;
}

export interface Trailer {
  id: number;
  title?: string;
  isHD?: boolean;
  youtubeId?: string;
}

export interface Individual {
  id: number;
  name?: string;
  job?: string;
}

export interface Episode {
  id: number;
  number: number;
  title?: string;
  plot?: string;
  durationMinutes?: number;
  images?: Images;
}

export interface LoadedSeason extends Season {
  episodes?: Episode[];
}

export interface ShowInfo extends Result {
  plot?: string;
  quality?: string;
  originalTitle?: string;
  status?: string;
  runtime?: string;
  views?: number;
  dailyViews?: number;
  releaseDate?: Date;
  seasons?: Season[];
  trailers?: Trailer[];
  images?: Images;
  genres?: string[];
  mainActors?: Individual[];
  mainDirectors?: Individual[];
  preview?: any;
  keywords?: string[];
  loadedSeason?: LoadedSeason;
  // sliders
}
