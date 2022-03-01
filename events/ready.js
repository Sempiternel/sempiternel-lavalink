module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    client.manager.init(client.user.id);
    client.emit("reloadNode", client.manager);
  },
};
