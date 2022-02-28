const { default: axios } = require("axios");

module.exports = {
  name: "emptyNode",
  once: true,
  async execute(manager) {
    for (const pair of manager.nodes) manager.destroyNode(pair[0]);

    const json = await axios.get(
      "https://lavalink.darrennathanael.com/api/servers.json"
    );

    json.data.ssl = json.data.ssl.map((node) => {
      return { secure: true, ...node };
    });
    json.data.nossl = json.data.nossl.map((node) => {
      return { secure: false, ...node };
    });

    const nodes = json.data.ssl.concat(json.data.nossl).map((node) => {
      return { ...node, port: Number(node.port) };
    });

    for (const option of nodes) {
      const node = manager.createNode(option);
      node.connect();
    }
  },
};
