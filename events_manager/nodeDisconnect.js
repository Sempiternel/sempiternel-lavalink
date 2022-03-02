module.exports = {
  name: "nodeDisconnect",
  execute(node) {
    if (node.manager.nodes.filter((node) => node.connected).size) return;

    for (const node of node.manager.nodes.filter((node) => !node.connected))
      node.connect();
  },
};
