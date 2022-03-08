const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("destroy")
    .setDescription("Destroy audio stream"),
  execute(interaction) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return;

    player.destroy();
    interaction.reply("The stream has been destroyed!");
  },
};
