module.exports = {
  name: "queueEnd",
  execute(client, player) {
    client.channels.cache
      .get(player.textChannel)
      .send("The playlist is finished");

    player.destroy();
  },
};
