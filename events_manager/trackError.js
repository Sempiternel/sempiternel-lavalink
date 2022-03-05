const { Permissions } = require("discord.js");

module.exports = {
  name: "trackError",
  execute(client, player, track, payload) {
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
    channel.send(
      `An error has occurred on the track (\`${payload.error}\`), sorry for the inconvenience`
    );
  },
};
