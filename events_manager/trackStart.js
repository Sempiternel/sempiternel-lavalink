const { Permissions } = require("discord.js");

const parse = (title) => {
  const array = title.split(/[^a-z| |-]/i);
  const item = array.find((element) => /(.+) - (.+)/.test(element));
  if (item) return item;
  return title;
};

module.exports = {
  name: "trackStart",
  execute(client, player, track) {
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;
    if (
      channel
        .permissionsFor(channel.guild.me)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    )
      channel.send(`Now play the music \`${track.title}\``);

    let query = track.title;
    if (!/(.+) - (.+)/.test(query))
      query = `${track.author.replace(" - Topic", "")} - ${query}`;
    track.query = parse(query);

    if (channel.guild.me.permissions.has(Permissions.FLAGS.CHANGE_NICKNAME))
      channel.guild.me.setNickname(track.query.substring(0, 32));
  },
};
