module.exports = {
  name: "queueEnd",
  execute(client, player) {
    const channel = client.channels.cache.get(player.textChannel);
    if (
      channel &&
      channel
        .permissionsFor(channel.guild.me)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    )
      channel.send("The playlist is finished");

    player.destroy();
  },
};
