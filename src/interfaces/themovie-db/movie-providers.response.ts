export interface WatchProvider {
  logoPath: string;
  providerId: number;
  providerName: string;
  displayPriority: number;
}

export interface CountryWatchOptions {
  link: string;
  buy?: WatchProvider[];
  rent?: WatchProvider[];
  flatrate?: WatchProvider[];
}

export interface MovieProviders {
  [countryCode: string]: CountryWatchOptions;
}

export interface MovieProvidersResponse {
  id: number;
  results: MovieProviders;
}
