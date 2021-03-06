const { Permissions } = require('discord.js');

module.exports = {
	name: 'playerDestroy',
	execute(client, player) {
		const channel = client.channels.cache.get(player.textChannel);
		if (!channel) return;
		if (channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) channel.send('The stream is now closed, I hope you liked it 💗');

		if (channel.guild.me.permissions.has(Permissions.FLAGS.CHANGE_NICKNAME)) channel.guild.me.setNickname(null);
	},
};
