const { SlashCommandBuilder } = require('@discordjs/builders');
const dayjs = require('dayjs');
const { MessageEmbed, Permissions } = require('discord.js');
dayjs.extend(require('dayjs/plugin/relativeTime'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play music')
		.addStringOption((option) =>
			option
				.setName('input')
				.setDescription('The music to look for')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option.setName('node').setDescription('The node to use'),
		),
	async execute(interaction) {
		if (!interaction.client.manager.nodes.filter((node) => node.connected).size) {return;}

		const node = interaction.options.getString('node');
		if (node) {
			const nodeInstance = interaction.client.manager.nodes.get(node);
			if (!nodeInstance) {return await interaction.reply(`Could not find node \`${node}\``);}
			if (!nodeInstance.connected) {return await interaction.reply(`\`${node}\` node is not online`);}
		}
		await interaction.deferReply();

		const result = await interaction.client.manager.search(
			{ source: 'youtube', query: interaction.options.getString('input') },
			interaction.user,
		);

		const embed = new MessageEmbed();
		let track;
		switch (result.loadType) {
		case 'SEARCH_RESULT': {
			let index = 0;

			if (
				interaction.channel
					.permissionsFor(interaction.guild.me)
					.has(Permissions.FLAGS.VIEW_CHANNEL)
			) {
				const reply = ['What music do you want? (give me the number)'];
				result.tracks
					.map((track1) => `${++index}. \`${track1.title}\``)
					.forEach((line) => reply.push(line));
				await interaction.editReply(reply.join('\n'));
				const collector = await interaction.channel
					.awaitMessages({
						filter: (message) => message.author.id == interaction.user.id,
						max: 1,
						time: 60 * 1000,
						errors: ['time'],
					})
					.catch(() => null);
				if (!collector) {return await interaction.editReply('No search response');}

				index = Number(collector.first().content);
				if (isNaN(index) || index < 1 || index > result.tracks.length) {
					return await interaction.editReply(
						`Couldn't find the music for number ${collector.first().content}`,
					);
				}
				--index;
			}
			result.tracks = [result.tracks[index]];
		}

		// eslint-disable-next-line no-fallthrough
		case 'TRACK_LOADED':
			track = result.tracks[0];
			embed.setTitle(track.title);
			embed.addFields([
				{
					name: 'Author',
					value: track.author,
					inline: true,
				},
				{
					name: 'Duration',
					value: dayjs().millisecond(track.duration).fromNow(true),
					inline: true,
				},
			]);
			if (track.displayThumbnail) {embed.setImage(track.displayThumbnail('maxresdefault'));}
			else {
				embed.setImage(track.thumbnail);
			}
			break;

		case 'PLAYLIST_LOADED':
			embed.setTitle(result.playlist.name);
			embed.addFields([
				{
					name: 'Duration',
					value: dayjs().millisecond(result.playlist.duration).fromNow(true),
					inline: true,
				},
				{
					name: 'Length',
					value: String(result.tracks.length),
					inline: true,
				},
			]);

			track = result.tracks[0];
			if (result.playlist.selectedTrack) {
				track = result.playlist.selectedTrack;
				embed.addField(
					'Selected Track',
					result.playlist.selectedTrack.title,
					true,
				);
			}
			if (track.displayThumbnail) {embed.setImage(track.displayThumbnail('maxresdefault'));}
			else {embed.setImage(track.thumbnail);}
			break;
		default:
			if (result.exception) await interaction.editReply(result.exception.message);
			return;
		}

		if (!interaction.member.voice.channel) {
			return await interaction.editReply(
				'You must be in a voice channel to listen to music!',
			);
		}
		await interaction.editReply({ content: null, embeds: [embed] });

		if (!interaction.member.voice.channel.joinable) {return await interaction.editReply('Unable to join the channel');}

		const player = interaction.client.manager.create({
			guild: interaction.guild.id,
			voiceChannel: interaction.member.voice.channel.id,
			textChannel: interaction.channel.id,
			selfDeafen: true,
			node,
		});
		player.connect();
		player.queue.add(result.tracks);

		if (!player.playing && !player.paused) player.play();
	},
};
