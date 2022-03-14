module.exports = {
	name: 'socketClosed',
	execute(client, player, payload) {
		if (payload.byRemote) player.destroy();
	},
};
