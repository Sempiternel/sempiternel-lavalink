const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("filters")
    .setDescription("Add an equalizer")
    .addStringOption((option) =>
      option
        .setName("filter")
        .setDescription("The filter to apply")
        .setRequired(true)
        .addChoices(
          [
            "nightcore",
            "vaporwave",
            "bassboost",
            "soft",
            "pop",
            "treblebass",
            ["8D", "eightD"],
            "karaoke",
            "vibrato",
            "tremolo",
            "reset",
          ].map((item) => {
            if (typeof item != "string") return item;
            return [item, item];
          })
        )
    ),
  execute(interaction) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return;

    const filter = interaction.options.getString("filter");

    if (filter == "reset") player.reset();
    else player[filter] = true;

    interaction.reply("The equalizer has been set");
  },
};
