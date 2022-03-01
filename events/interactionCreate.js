module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isCommand() || !interaction.inCachedGuild()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
      if (
        interaction.deferred &&
        !interaction.replied &&
        !interaction.ephemeral
      )
        await interaction.deleteReply();
    } catch (error) {
      console.error(error);
      const options = {
        content: "There was an error while executing this command!",
        ephemeral: true,
      };
      if (interaction.deferred || interaction.replied)
        await interaction.editReply(options);
      else await interaction.reply(options);
    }
  },
};
