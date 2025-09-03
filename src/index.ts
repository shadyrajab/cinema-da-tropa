import { Client } from 'discord.js';
import { DISCORD_TOKEN } from './config/constants';
import { onAutocompleteInteraction } from './events/autocomplete.interaction';
import { Scheduler } from './utils/scheduler/scheduler';
import { SearchMovieCommand, SearchMovieData } from './commands/search-movie';
import { HostMovieCommand, HostMovieData } from './commands/host-movie';
import { initializeDatabase } from './db/db';

const client = new Client({
  intents: ['GuildMessages'],
});

client.on('ready', async (client) => {
  client.application.commands.set([SearchMovieData, HostMovieData]);
  await initializeDatabase();
  console.log(`Logged in as ${client.user?.username}`);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isAutocomplete()) {
    onAutocompleteInteraction(interaction);
  }
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'movie') {
      await SearchMovieCommand(interaction);
    }
    if (interaction.commandName === 'host') {
      await HostMovieCommand(interaction);
    }
  }
    
  if (interaction.isButton() && interaction.customId.startsWith('rate_')) {
    Scheduler.handleRatingButton(interaction)
  }
});

client.login(DISCORD_TOKEN);
