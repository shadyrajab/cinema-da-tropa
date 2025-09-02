export type CommandValidator = HostValidatedParams;

export interface HostValidatedParams {
  movieId?: number;
  startDate?: Date;
  startTime?: string;
}
