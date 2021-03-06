module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand() || !interaction.inCachedGuild()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) return;

		try {
			await command.execute(interaction);
			await interaction.fetchReply();
			if (!interaction.replied) {
				const content = 'The command did not respond, did you use the command correctly?';
				if (interaction.deferred) await interaction.editReply(content);
				else await interaction.reply(content);
			}
		}
		catch (error) {
			const options = { content: 'There was an error while executing this command!', ephemeral: true };
			// eslint-disable-next-line no-empty-function
			if (interaction.deferred || interaction.replied) {await interaction.editReply(options).catch(() => {});}
			// eslint-disable-next-line no-empty-function
			else {await interaction.reply(options).catch(() => {});}
		}
	},
};
