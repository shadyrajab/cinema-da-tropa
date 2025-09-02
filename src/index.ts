import { Client } from 'discord.js';
import { DISCORD_TOKEN } from './config/constants';
import { SearchMovieCommand, SearchMovieData } from './commands/search-movie';
import { HostMovieCommand, HostMovieData } from './commands/host-movie';
import { onAutocompleteInteraction } from './events/autocomplete.interaction';

const client = new Client({
  intents: ['GuildMessages'],
});

client.on('ready', (client) => {
  client.application.commands.set([SearchMovieData, HostMovieData]);
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
});

client.login(DISCORD_TOKEN);
