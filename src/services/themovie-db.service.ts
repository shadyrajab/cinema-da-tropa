import { join } from 'path';
import { writeFileSync } from 'fs';
import { TheMovieDBClient } from '../utils/http/themovie-db.client';
import { MovieDetailsResponse } from '../interfaces/themovie-db/movie-details.response';
import { SearchMovieResponse } from '../interfaces/themovie-db/search.response';
import { MovieProvidersResponse } from '../interfaces/themovie-db/movie-providers.response';

export class TheMovieDBService {
  private theMovieDBClient: TheMovieDBClient;

  constructor(theMovieDBClient?: TheMovieDBClient) {
    this.theMovieDBClient = theMovieDBClient;
  }

  public get tmdbImageCdnURL() {
    return this.theMovieDBClient.tmdbImageCdnURL;
  }

  public getMovieById(id: number): Promise<MovieDetailsResponse> {
    return this.theMovieDBClient.searchMovieById(id);
  }

  public async searchMovieByName(
    movieName: string,
    countryCode: string,
  ): Promise<SearchMovieResponse> {
    const movies = await this.theMovieDBClient.searchMovieByName(movieName);
    const moviesWithProviders = await Promise.all(
      movies.results.map(async (movie) => {
        const movieProviders: MovieProvidersResponse =
          await this.theMovieDBClient.getMovieProviders(movie.id);

        const countryProviders = movieProviders.results[countryCode];

        return {
          ...movie,
          providers: countryProviders,
        };
      }),
    );

    return {
      ...movies,
      results: moviesWithProviders,
    };
  }

  public async getWatchProvidersLogosJSON(
    language: string,
    countryCode: string,
  ): Promise<void> {
    const watchProviders = await this.theMovieDBClient.getAllProviders(
      language,
      countryCode,
    );

    const providers = watchProviders.results
      .map((provider) => {
        const logoUrl =
          this.theMovieDBClient.tmdbImageCdnURL + provider.logoPath;
        return {
          attachment: logoUrl,
          name: provider.logoPath,
        };
      })
      .filter(Boolean);
    const filePath = join(__dirname, '../watchProviders.json');
    writeFileSync(filePath, JSON.stringify(providers, null, 2));
  }
}
