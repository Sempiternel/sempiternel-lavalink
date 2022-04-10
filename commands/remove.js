const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Remove tracks')
		.addIntegerOption((option) =>
			option
				.setName('index')
				.setDescription('Index of the track to be removed')
				.setRequired(true)
				.setMinValue(1),
		)
		.addIntegerOption((option) =>
			option.setName('to').setDescription('To').setMinValue(1),
		),
	execute(interaction) {
		const player = interaction.client.manager.get(interaction.guild.id);
		if (!player) return;

		const index = interaction.options.getInteger('index') - 1;
		const to = interaction.options.getInteger('to') || index + 1;
		if (index > player.queue.size || to > player.queue.size) return;

		const tracks = player.queue.remove(index, to);
		return interaction.reply(`${tracks.size} tracks have been removed`);
	},
};
