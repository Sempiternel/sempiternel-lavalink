const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const toString = (track) => `[${track.title}](${track.uri})`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("View Queue")
    .addIntegerOption((option) =>
      option
        .setName("page")
        .setDescription("The page to display")
        .setMinValue(1)
    ),
  execute(interaction) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return;

    const track_max = 15;
    let page = interaction.options.getInteger("page") || 1;
    const page_max = Math.ceil(player.queue.size / track_max);
    if (page > page_max) page = page_max;

    const embed = new MessageEmbed()
      .addField("Now playing", toString(player.queue.current))
      .setFooter({
        text: dayjs().millisecond(player.queue.duration).fromNow(true),
      });
    if (page_max > 1)
      embed.setFooter({
        text: `${embed.footer.text} | ${page}/${page_max}`,
      });
    if (player.queue.size) {
      let index = (page - 1) * track_max;
      const items = player.queue.slice(index, page * track_max);
      embed.setDescription(
        items.map((track) => `\`${++index}.\` ${toString(track)}`).join("\n")
      );
    }

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
