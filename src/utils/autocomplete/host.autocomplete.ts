import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
} from 'discord.js';

export async function handleHostAutocomplete(
  interaction: AutocompleteInteraction,
) {
  const focusedOption = interaction.options.getFocused(true);
  let choices: ApplicationCommandOptionChoiceData[] = [];

  if (focusedOption.name === 'startdate') {
    choices = generateDateChoices();
  } else if (focusedOption.name === 'starttime') {
    choices = generateTimeChoices();
  }

  const filtered = choices
    .filter((choice) =>
      choice.name.toLowerCase().includes(focusedOption.value.toLowerCase()),
    )
    .slice(0, 25);

  await interaction.respond(filtered);
}

function generateDateChoices(): ApplicationCommandOptionChoiceData[] {
  const choices = [];
  const today = new Date();

  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const formattedDate = date.toISOString().split('T')[0];
    choices.push({
      name: formattedDate,
      value: formattedDate,
    });
  }

  return choices;
}

function generateTimeChoices(): ApplicationCommandOptionChoiceData[] {
  const choices = [];
  const minutes = ['00', '15', '30', '45'];

  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour.toString().padStart(2, '0');

    for (const minute of minutes) {
      const time = `${formattedHour}:${minute}`;
      choices.push({
        name: time,
        value: time,
      });
    }
  }

  return choices;
}
