import {
  THE_MOVIE_DB_API_KEY,
  THE_MOVIE_DB_API_URL,
} from '../config/constants';
import { TheMovieDBService } from '../services/themovie-db.service';
import { TheMovieDBClient } from '../utils/http/themovie-db.client';

export const TheMovieDBServiceFactory = () => {
  const theMovieDBClient = new TheMovieDBClient(
    THE_MOVIE_DB_API_URL,
    THE_MOVIE_DB_API_KEY,
  );
  return new TheMovieDBService(theMovieDBClient);
};
