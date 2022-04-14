const nodes = require('../nodes.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		const nodes1 = nodes.ssl.map(node => {
			return { ...node, port: 443, secure: true };
		}).concat(nodes.nossl).map((node) => {
			return { ...node, retryDelay: 60 * 60 * 1000 };
		});

		client.manager.init(client.user.id);
		for (const option of nodes1) {
			const node = client.manager.createNode(option);
			node.connect();
		}
	},
};
