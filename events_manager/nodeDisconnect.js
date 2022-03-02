let attempt = false;
const reconnect = (manager) => {
  attempt = false;
  if (manager.nodes.filter((node) => node.connected).size) return;

  manager.nodes
    .filter((node) => !node.connected)
    .forEach((node) => node.connect());
};

module.exports = {
  name: "nodeDisconnect",
  execute(client, node) {
    if (attempt) return;
    attempt = true;

    setTimeout(() => reconnect(node.manager), 60 * 1000);
  },
};
