module.exports = {
  name: "trackError",
  execute(client, player, track, payload) {
    client.channels.cache
      .get(player.textChannel)
      .send(
        `An error has occurred on the track (\`${payload.error}\`), sorry for the inconvenience`
      );
  },
};
