export interface MovieDetailsResponse {
  adult: boolean;
  backdropPath: string;
  belongsToCollection: null | object;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdbId: string;
  originCountry: string[];
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: string;
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  releaseDate: string;
  revenue: number;
  runtime: number;
  spokenLanguages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
}

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  logoPath: string | null;
  name: string;
  originCountry: string;
}

interface ProductionCountry {
  iso31661: string;
  name: string;
}

interface SpokenLanguage {
  englishName: string;
  iso6391: string;
  name: string;
}
