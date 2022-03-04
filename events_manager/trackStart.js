const { Permissions } = require("discord.js");

module.exports = {
  name: "trackStart",
  execute(client, player, track) {
    const channel = client.channels.cache.get(player.textChannel);
    channel.send(`Now play the music \`${track.title}\``);

    if (channel.guild.me.permissions.has(Permissions.FLAGS.CHANGE_NICKNAME))
      channel.guild.me.setNickname(track.query.substring(0, 32));
  },
};
