const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('seek')
		.setDescription('Seek the current track')
		.addIntegerOption((option) =>
			option
				.setName('seconds')
				.setDescription('The number of seconds to seek')
				.setRequired(true)
				.setMinValue(1),
		),
	execute(interaction) {
		const player = interaction.client.manager.get(interaction.guild.id);
		if (!player) return;
		if (!(player.queue.current && player.queue.current.isSeekable)) return interaction.reply('This track is not seekable!');

		const seconds = interaction.options.getInteger('seconds');
		player.seek(seconds * 1000);
		interaction.reply(`The current track is now at ${seconds} seconds`);
	},
};
