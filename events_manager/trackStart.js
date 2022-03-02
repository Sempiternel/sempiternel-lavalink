module.exports = {
  name: "trackStart",
  execute(client, player, track) {
    client.channels.cache
      .get(player.textChannel)
      .send(`Now play the music \`${track.title}\``);
  },
};
