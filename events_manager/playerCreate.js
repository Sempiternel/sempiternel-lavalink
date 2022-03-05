const { Permissions } = require("discord.js");

module.exports = {
  name: "playerCreate",
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
    channel.send(
      `The stream has just been created! (on the \`${player.node.options.identifier}\` node)`
    );
  },
};
