const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip music")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("Number of tracks to skip")
    ),
  execute(interaction) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return;

    interaction.reply(`Skiping track \`${player.queue.current.title}\``);
    player.stop(interaction.options.getInteger("amount") || 1);
  },
};
