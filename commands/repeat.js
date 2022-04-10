const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('repeat')
		.setDescription('Repeat tracks')
		.addStringOption((option) =>
			option
				.setName('type')
				.setDescription('The way to repeat')
				.addChoices(['track', 'queue'].map((item) => [item, item])),
		),
	execute(interaction) {
		const player = interaction.client.manager.get(interaction.guild.id);
		if (!player) return;

		const type = interaction.options.getString('type') || 'queue';
		const bool = type == 'track' ? !player.trackRepeat : !player.queueRepeat;

		if (type == 'track') player.setTrackRepeat(bool);
		else player.setQueueRepeat(bool);

		if (bool) return interaction.reply(`The ${type} is now repeated`);
		else return interaction.reply(`The ${type} is no longer repeated`);
	},
};
