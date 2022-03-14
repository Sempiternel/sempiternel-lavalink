const { SlashCommandBuilder } = require('@discordjs/builders');

const customFilter = {
	daycore: {
		op: 'filters',
		timescale: {
			speed: 1,
			pitch: 0.8,
			rate: 1,
		},
	},
	slowed: {
		op: 'filters',
		timescale: {
			speed: 0.7,
			pitch: 0.7,
			rate: 1,
		},
	},
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('filters')
		.setDescription('Add an equalizer')
		.addStringOption((option) =>
			option
				.setName('filter')
				.setDescription('The filter to apply')
				.setRequired(true)
				.addChoices(
					[
						'daycore',
						'slowed',
						'nightcore',
						'vaporwave',
						'bassboost',
						'soft',
						'pop',
						'treblebass',
						['8D', 'eightD'],
						'karaoke',
						'vibrato',
						'tremolo',
						'reset',
					].map((item) => {
						if (typeof item != 'string') return item;
						return [item, item];
					}),
				),
		),
	execute(interaction) {
		const player = interaction.client.manager.get(interaction.guild.id);
		if (!player) return;

		const filter = interaction.options.getString('filter');
		if (filter == 'reset') {player.reset();}
		else if (customFilter[filter]) {
			const data = customFilter[filter];
			data.guildId = player.guild;
			player.node.send(data);
		}
		else {player[filter] = true;}

		interaction.reply('The equalizer has been set');
	},
};
