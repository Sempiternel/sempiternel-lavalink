module.exports = {
  name: "trackStuck",
  execute(client, player) {
    const channel = client.channels.cache.get(player.textChannel);
    if (
      !(
        channel &&
        channel
          .permissionsFor(channel.guild.me)
          .has(Permissions.FLAGS.SEND_MESSAGES)
      )
    )
      return;
    channel.send("The track is blocked, sorry for the inconvenience");
  },
};
