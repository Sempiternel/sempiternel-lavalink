module.exports = {
  name: "nodeDisconnect",
  execute(client, node) {
    if (node.manager.nodes.filter((node) => node.connected).size) return;

    const nodes = node.manager.nodes.filter((node) => !node.connected);
    for (const node of nodes) node.connect();
  },
};
