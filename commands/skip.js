const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip music")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of tracks to skip")
        .setMinValue(1)
    ),
  execute(interaction) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return;

    let amount = interaction.options.getInteger("amount") || 1;
    if (amount > player.queue.totalSize) amount = player.queue.totalSize;

    if (amount > 1)
      interaction.reply(
        `Skiping ${amount} tracks \`${player.queue.current.title}\``
      );
    else interaction.reply(`Skiping track \`${player.queue.current.title}\``);
    player.stop(amount);
  },
};
