const { Permissions } = require('discord.js');

module.exports = {
	name: 'voiceStateUpdate',
	execute(oldState) {
		const channel = oldState.channel;
		if (!channel) return;

		const player = channel.client.manager.get(channel.guild.id);
		if (!player || channel.id != player.voiceChannel) return;

		const size = channel.members.filter((member) => !member.user.bot).size;
		if (size) return;

		const textChannel = channel.client.channels.cache.get(player.textChannel);
		if (textChannel && textChannel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) textChannel.send('Well I no longer have anyone to listen to music with, it doesn\'t matter 😅');
		player.disconnect();
	},
};
