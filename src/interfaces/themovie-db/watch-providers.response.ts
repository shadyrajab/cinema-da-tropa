export interface WatchProvidersResponse {
  results: Provider[];
}

export interface Provider {
  displayPriorities: Record<string, number>;
  displayPriority: number;
  logoPath: string;
  providerName: string;
  providerId: number;
}
