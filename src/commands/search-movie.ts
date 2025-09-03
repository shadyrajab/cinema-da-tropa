import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationEmoji,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  Interaction,
  InteractionCollector,
} from 'discord.js';
import { ICommandData } from '../interfaces/command.interface';
import { TheMovieDBService } from '../services/themovie-db.service';
import { TheMovieDBServiceFactory } from '../factories/themovie-db-service.factory';
import { Movie } from '../interfaces/themovie-db/search.response';
import { CountryWatchOptions } from '../interfaces/themovie-db/movie-providers.response';

export const SearchMovieData: ICommandData = {
  name: 'movie',
  description: 'movie command',
  category: 'cinema',
  options: [
    {
      name: 'movie',
      description: 'movie name',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export const SearchMovieCommand = async (
  interaction: ChatInputCommandInteraction,
): Promise<void> => {
  const emojis = interaction.client.application.emojis.cache;
  const movieName = interaction.options.get('movie').value.toString();
  const theMovieDBService = TheMovieDBServiceFactory();
  const movies = await theMovieDBService.searchMovieByName(movieName, 'BR');

  let currentMovieIndex = 0;
  let totalPages = movies.results.length;

  const embeds = await Promise.all(
    movies.results.map(
      async (movie) => await createMovieEmbed(movie, emojis, theMovieDBService),
    ),
  );

  const response = await interaction.reply({
    embeds: [embeds[currentMovieIndex]],
    withResponse: true,
    components: [await buildActionButtons(currentMovieIndex, totalPages)],
  });

  const filter = (i: Interaction) => i.user.id === interaction.user.id;
  const collector = response.resource.message.createMessageComponentCollector({
    filter,
    time: 60000,
  });

  await componentCollector(collector, currentMovieIndex, totalPages, embeds);
};

const buildActionButtons = async (
  currentMovieIndex: number,
  totalPages: number,
): Promise<ActionRowBuilder<ButtonBuilder>> => {
  const prev = new ButtonBuilder()
    .setCustomId('prev')
    .setLabel('◀️')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(currentMovieIndex === 0);
  const next = new ButtonBuilder()
    .setCustomId('next')
    .setLabel('▶️')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(currentMovieIndex === totalPages - 1);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(prev, next);
};

const componentCollector = async (
  collector: InteractionCollector<any>,
  currentMovieIndex: number,
  totalPages: number,
  embeds: EmbedBuilder[],
) => {
  collector.on('collect', async (i) => {
    if (i.customId === 'next' && currentMovieIndex < totalPages - 1) {
      currentMovieIndex++;
    } else if (i.customId === 'prev' && currentMovieIndex > 0) {
      currentMovieIndex--;
    }
    await i.update({
      embeds: [embeds[currentMovieIndex]],
      components: [await buildActionButtons(currentMovieIndex, totalPages)],
    });
  });
};

export const createMovieEmbed = async (
  movie: Movie,
  emojis: Collection<string, ApplicationEmoji>,
  theMovieDBService: TheMovieDBService,
) => {
  const logoUrl = theMovieDBService.tmdbImageCdnURL + movie.posterPath;
  const embed = new EmbedBuilder()
    .setColor('#FF5733')
    .setTitle(movie.title)
    .setImage(logoUrl);

  if (movie.overview && movie.overview.trim().length > 0) {
    embed.setDescription(movie.overview);
  }

  const fields = [];

    if (movie.id) {
    fields.push({
      name: 'ID',
      value: movie.id.toString(),
      inline: true,
    });
  }

  if (movie.releaseDate) {
    fields.push({
      name: 'Release Date',
      value: movie.releaseDate,
      inline: true,
    });
  }

  if (movie.voteAverage !== undefined && movie.voteAverage !== null) {
    fields.push({
      name: 'Rating',
      value: `${movie.voteAverage}/10`,
      inline: true,
    });
  }

  if (movie.popularity !== undefined && movie.popularity !== null) {
    fields.push({
      name: 'Popularity',
      value: `${movie.popularity}`,
      inline: true,
    });
  }

  const providersValue = await formatProviders(movie.providers, emojis);
  if (providersValue && providersValue !== 'Não encontrado') {
    fields.push({
      name: 'Providers',
      value: providersValue,
      inline: false,
    });
  }

  return embed
    .addFields(fields)
    .setFooter({ text: 'Data provided by TheMovieDB' });
};

const getEmoji = (
  logoPath: string,
  emojis: Collection<string, ApplicationEmoji>,
) => {
  const emojiName = logoPath.replace('/', '').replace('.jpg', '');
  const emoji = emojis.find((e) => e.name === emojiName);
  return emoji ? `<:${emoji.name}:${emoji.id}>` : '❓';
};

const formatProviders = async (
  providers: CountryWatchOptions,
  emojis: Collection<string, ApplicationEmoji>,
) => {
  if (!providers) return 'Não encontrado';
  const flatRate =
    providers.flatrate
      ?.map((p) => `${getEmoji(p.logoPath, emojis)} ${p.providerName}`)
      .join('\n') || 'Nenhum';

  const buy =
    providers.buy
      ?.map((p) => `${getEmoji(p.logoPath, emojis)} ${p.providerName}`)
      .join('\n') || 'Nenhum';

  const rent =
    providers.rent
      ?.map((p) => `${getEmoji(p.logoPath, emojis)} ${p.providerName}`)
      .join('\n') || 'Nenhum';

  return `**Streaming:**\n${flatRate}\n\n**Compra:**\n${buy}\n\n**Aluguel:**\n${rent}`;
};
