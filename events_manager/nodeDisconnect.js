module.exports = {
  name: "nodeDisconnect",
  execute(client, node) {
    if (node.manager.nodes.filter((node) => node.connected).size) return;

    node.manager.nodes
      .filter((node) => !node.connected)
      .forEach((node) => node.connect());
  },
};
