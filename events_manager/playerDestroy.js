module.exports = {
  name: "playerDestroy",
  execute(client, player) {
    client.channels.cache
      .get(player.textChannel)
      .send("The stream is now closed, I hope you liked it 💗");
  },
};
