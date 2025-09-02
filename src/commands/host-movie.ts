import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
} from 'discord.js';
import { ICommandData } from '../interfaces/command.interface';
import { validateHostParams } from '../utils/validators/host.command-validator';
import { TheMovieDBServiceFactory } from '../factories/themovie-db-service.factory';

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
};
