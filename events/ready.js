const nodes = require('../nodes.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setPresence({ activities: [], status: 'online' });

		client.manager.init(client.user.id);

		const nodes1 = nodes.ssl.concat(nodes.nossl).map((node) => {
			return { ...node, retryDelay: 60 * 60 * 1000 };
		});

		for (const option of nodes1) {
			const node = client.manager.createNode(option);
			node.connect();
		}
	},
};
