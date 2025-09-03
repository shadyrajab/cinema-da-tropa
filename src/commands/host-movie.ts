import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  GuildBasedChannel,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  TextChannel,
} from 'discord.js';
import { ICommandData } from '../interfaces/command.interface';
import { validateHostParams } from '../utils/validators/host.command-validator';
import { TheMovieDBServiceFactory } from '../factories/themovie-db-service.factory';
import { AppDataSource } from '../db/db';
import { Movie } from '../entities/movie';
import { DISCORD_MOVIE_CHANNEL_ID } from '../config/constants';
import { Scheduler } from '../utils/scheduler/scheduler';

export const HostMovieData: ICommandData = {
  name: 'host',
  description: 'host command',
  permissions: {
    some: ['Administrator'],
  },
  category: 'cinema',
  options: [
    {
      name: 'movieid',
      description: 'The movie ID',
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: 'startdate',
      description: 'The date on the format YYYY-MM-DD',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: 'starttime',
      description: 'The time on the format HH:MM',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],
};

export const HostMovieCommand = async (
  interaction: ChatInputCommandInteraction,
) => {
  const theMovieDBService = TheMovieDBServiceFactory();
  const { movieId, startDate } =
    await validateHostParams(interaction);
  const { guild } = interaction;
  const { posterPath, title, overview, runtime } =
    await theMovieDBService.getMovieById(movieId);
  const eventChannel = await guild.channels.create({
    name: title,
    type: ChannelType.GuildStageVoice,
    parent: '1058190949504782386',
  });

  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + runtime);

  await interaction.reply({
    content: `Evento foi criado. <#${eventChannel.id}>`,
    ephemeral: true,
  });

  await guild.scheduledEvents.create({
    name: title,
    privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
    scheduledStartTime: startDate,
    scheduledEndTime: endDate,
    entityType: GuildScheduledEventEntityType.StageInstance,
    image: theMovieDBService.tmdbImageCdnURL + posterPath,
    channel: eventChannel.id,
    description: overview,
    reason: 'Cinema Movie',
    entityMetadata: {
      location: `Hosted by ${interaction.user.username}`,
    },
  });

  const movieRepository = AppDataSource.getRepository(Movie);
  const movie = movieRepository.create({ title, finished_at: endDate, tmdb_id: movieId.toString() });
  await movieRepository.save(movie);

  const movieChannel = await guild.channels.fetch(DISCORD_MOVIE_CHANNEL_ID);
  if (movieChannel?.isTextBased()) {
    await movieChannel.send({
      content: `${movie.title} !`,
    });
  }

  const scheduler = new Scheduler(movieChannel as TextChannel);
  scheduler.scheduleRatingMessage(movie.id, movie.title, startDate, endDate);

  return;
};
