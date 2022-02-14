const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music")
    .addStringOption(option => option.setName('input').setDescription('The music you want')),
  async execute(interaction) {
    // Note: This example only works for retrieving tracks using a query, such as "Rick Astley - Never Gonna Give You Up".

    // Retrieves tracks with your query and the requester of the tracks.
    // Note: This retrieves tracks from youtube by default, to get from other sources you must enable them in application.yml and provide a link for the source.
    // Note: If you want to "search" for tracks you must provide an object with a "query" property being the query to use, and "source" being one of "youtube", "soundcloud".
    const res = await interaction.client.manager.search(
		interaction.options.getString('input') || '',
		interaction.user
    );

    // Create a new player. This will return the player if it already exists.
    const player = interaction.client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: interaction.member.voice.channel.id,
      textChannel: interaction.channel.id,
    });

    // Connect to the voice channel.
    player.connect();

    // Adds the first track to the queue.
    player.queue.add(res.tracks[0]);
	interaction.reply(`Enqueuing track ${res.tracks[0].title}.`);

    // Plays the player (plays the first track in the queue).
    // The if statement is needed else it will play the current track again
    if (!player.playing && !player.paused && !player.queue.size) player.play();

    // For playlists you'll have to use slightly different if statement
    if (
      !player.playing &&
      !player.paused &&
      player.queue.totalSize === res.tracks.length
    )
      player.play();
  },
};
