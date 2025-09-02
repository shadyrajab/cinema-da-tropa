import { config } from 'dotenv';

config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const THE_MOVIE_DB_API_KEY = process.env.THE_MOVIE_DB_API_KEY;
export const THE_MOVIE_DB_API_URL = process.env.THE_MOVIE_DB_API_URL;
