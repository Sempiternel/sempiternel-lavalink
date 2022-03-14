const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Change bot volume')
		.addIntegerOption((option) =>
			option
				.setName('percent')
				.setDescription('Percentage of bot volume to put')
				.setMinValue(50)
				.setMaxValue(200),
		),
	execute(interaction) {
		const player = interaction.client.manager.get(interaction.guild.id);
		if (!player) return;

		const percent = interaction.options.getInteger('percent');
		player.setVolume(percent);
		interaction.reply(`Stream volume is now ${percent}%`);
	},
};
