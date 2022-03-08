const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("See lyrics")
    .addStringOption((option) =>
      option.setName("title").setDescription("Music title")
    )
    .addStringOption((option) =>
      option.setName("artist").setDescription("Music artist")
    ),
  async execute(interaction) {
    let title = interaction.options.getString("title") || "";
    const artist = interaction.options.getString("artist") || "";

    if (!title.length) {
      const player = interaction.client.manager.get(interaction.guild.id);
      if (!player) return;
      const track = player.queue.current;
      if (!track) return;
      title = track.query;
    }

    await interaction.deferReply();
    const lyrics = (await lyricsFinder(artist, title)) || "Not Found!";

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
    if (artist.length) title = `${artist} - ${title}`;
    embeds[0].setTitle(title);
    await interaction.editReply({ embeds });
  },
};
