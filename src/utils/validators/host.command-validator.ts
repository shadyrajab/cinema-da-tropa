import { ChatInputCommandInteraction } from 'discord.js';
import { HostValidatedParams } from '../../interfaces/command-params.interface';

export async function validateHostParams(
  interaction: ChatInputCommandInteraction,
): Promise<HostValidatedParams> {
  const validatedParams: HostValidatedParams = {};

  const movieIdOption = interaction.options.get('movieid')?.value;
  const startDateOption = interaction.options.get('startdate')?.value;
  const startTimeOption = interaction.options.get('starttime')?.value;

  if (!movieIdOption || !startDateOption || !startTimeOption) {
    throw new Error('Parâmetros obrigatórios ausentes.');
  }

  const movieId = movieIdOption.toString();
  const startDate = startDateOption.toString();
  const startTime = startTimeOption.toString();

  const eventDateTime = new Date(`${startDate}T${startTime}:00`);

  validatedParams.movieId = parseInt(movieId);
  validatedParams.startDate = eventDateTime;
  validatedParams.startTime = startTime;

  return validatedParams;
}
