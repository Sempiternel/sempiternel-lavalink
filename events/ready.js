const { default: axios } = require("axios");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setPresence({ activities: [], status: "online" });

    client.manager.init(client.user.id);
    const json = await axios.get(
      "https://lavalink.darrennathanael.com/api/servers.json"
    );

    json.data.ssl = json.data.ssl.map((node) => {
      return { secure: true, ...node };
    });
    json.data.nossl = json.data.nossl.map((node) => {
      return { secure: false, ...node };
    });

    //.concat(json.data.nossl)
    const nodes = json.data.ssl.map((node) => {
      return { ...node, port: Number(node.port) };
    });

    for (const option of nodes) {
      const node = client.manager.createNode(option);
      node.connect();
    }
  },
};
