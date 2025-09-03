import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, EmbedBuilder, TextChannel } from "discord.js";
import { AppDataSource } from "../../db/db";
import { MovieRating } from "../../entities/movie-rating";

export class Scheduler {
  private movieChannel: TextChannel;

  constructor(movieChannel: TextChannel) {
    this.movieChannel = movieChannel;
  }

  public scheduleRatingMessage(movieId: number, title: string, endTime: Date) {
    const now = new Date();
    const delay = endTime.getTime() - now.getTime();
    if (delay <= 0) {
      this.sendRatingMessage(movieId, title)
      return
    }

    console.log(`Scheduling rating message for movie ${movieId} in ${delay}ms from ${now} to ${endTime}`);
  }

  public static handleRatingButton(interaction: ButtonInteraction) {
    const userId = interaction.user.id;
    const rating = interaction.customId.split("_")[2];

    const movieRatingRepository = AppDataSource.getRepository(MovieRating);
    movieRatingRepository.findBy({ user_id: userId }).then(existingRating => {
      if (existingRating.length > 0) {
        interaction.reply({ content: "Voce ja deu sua nota!", ephemeral: true });
        return;
      }
    });

    const movieId = parseInt(interaction.customId.split("_")[1]);
    const movieRating = movieRatingRepository.create({
      movie_id: movieId,
      user_id: userId,
      rating: parseInt(rating),
    });
    movieRatingRepository.save(movieRating);

    interaction.reply({ content: `Obrigado por avaliar com ${rating} estrelas!`, ephemeral: true });
  }

  sendRatingMessage(movieId: number, title: string) {
    if (!this.movieChannel) {
      console.log("MovieChannel nao encontrado.");
      return 
    }
    const ratingButtons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`rate_${movieId}_1`)
          .setLabel('⭐ 1')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`rate_${movieId}_2`)
          .setLabel('⭐⭐ 2')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`rate_${movieId}_3`)
          .setLabel('⭐⭐⭐ 3')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`rate_${movieId}_4`)
          .setLabel('⭐⭐⭐⭐ 4')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`rate_${movieId}_5`)
          .setLabel('⭐⭐⭐⭐⭐ 5')
          .setStyle(ButtonStyle.Secondary),
      )
    
    const ratingEmbed = new EmbedBuilder()
      .setTitle(`📽️ De sua nota - ${title}`)
      .setColor(0x00AE86)

    this.movieChannel.send({
      content: 'o filme acbao',
      embeds: [ratingEmbed],
      components: [ratingButtons,]
    })
  }
}