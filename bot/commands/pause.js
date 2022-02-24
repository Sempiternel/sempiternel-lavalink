const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Toggle music pause"),
  execute(interaction) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return;

    player.pause(!player.paused);
    if (player.paused) interaction.reply("The bot is now paused");
    else interaction.reply("The bot is no longer paused");
  },
};