const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");

const getThumbnail = (track) => {
  if (track.displayThumbnail) return track.displayThumbnail("maxresdefault");
  return track.thumbnail;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The music to look for")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.client.manager.leastUsedNodes.first()) return;
    const res = await interaction.client.manager.search(
      interaction.options.getString("input"),
      interaction.user
    );
    if (!res.tracks.length) return;

    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.CONNECT))
      return;
    const player = interaction.client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: interaction.member.voice.channel.id,
      textChannel: interaction.channel.id,
      selfDeafen: true,
    });
    player.connect();

    const embed = new MessageEmbed();

    if (res.loadType != "PLAYLIST_LOADED") {
      res.tracks.splice(1, res.tracks.length - 1);
      embed
        .setDescription(res.tracks[0].title)
        .setImage(getThumbnail(res.tracks[0]));
    } else
      embed
        .setDescription(res.playlist.name)
        .setImage(getThumbnail(res.playlist.selectedTrack || res.tracks[0]))
        .setFooter({ text: `${res.tracks.length} tracks added` });

    player.queue.add(res.tracks);
    if (!player.playing && !player.paused) player.play();

    interaction.reply({ embeds: [embed] });
  },
};