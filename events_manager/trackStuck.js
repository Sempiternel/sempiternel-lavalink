module.exports = {
  name: "trackStuck",
  execute(client, player) {
    client.channels.cache
      .get(player.textChannel)
      .send("The track is blocked, sorry for the inconvenience");
  },
};
