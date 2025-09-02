import { AutocompleteInteraction } from 'discord.js';
import { handleHostAutocomplete } from '../utils/autocomplete/host.autocomplete';

export const onAutocompleteInteraction = async (
  interaction: AutocompleteInteraction,
) => {
  const commandName = interaction.commandName;

  switch (commandName) {
    case 'host':
      await handleHostAutocomplete(interaction);
      break;
  }
};
