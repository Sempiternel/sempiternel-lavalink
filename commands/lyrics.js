const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("See lyrics"),
  async execute(interaction) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return;

    const track = player.queue.current;
    if (!track) return;

    await interaction.deferReply();
    const lyrics = (await lyricsFinder("", track.query)) || "Not Found!";

    const chunk = [];
    {
      let current = "";
      for (const str of lyrics.split("\n"))
        if (current.length + str.length > 4096) {
          chunk.push(current);
          current = "";
        } else {
          if (current.length) current += "\n";
          current += str;
        }
      if (current.length) chunk.push(current);
    }

    const embeds = chunk.map((lyrics) =>
      new MessageEmbed().setDescription(lyrics)
    );
    embeds[0].setTitle(track.query);
    await interaction.editReply({ embeds });
  },
};
