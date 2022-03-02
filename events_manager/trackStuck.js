module.exports = {
  name: "trackStuck",
  execute(client, player) {
    client.channels.cache.get(player.textChannel).send("Track stuck");
  },
};
