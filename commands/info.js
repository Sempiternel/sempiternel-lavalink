const { SlashCommandBuilder } = require("@discordjs/builders");
const dayjs = require("dayjs");
const { MessageEmbed } = require("discord.js");
dayjs.extend(require("dayjs/plugin/relativeTime"));
const osu = require("node-os-utils");

const chunk = (arr, n) =>
  arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : [];
const kilo = (integer) => Math.floor((integer / 1024) * 100) / 100;
const mega = (integer) => kilo(kilo(integer));
const giga = (integer) => kilo(kilo(kilo(integer)));

const general = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const promises = [
    interaction.client.shard.fetchClientValues("guilds.cache.size"),
    interaction.client.shard.broadcastEval((client) =>
      client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
    ),
    interaction.client.shard.broadcastEval(
      (client) => client.manager.players.size
    ),
  ];
  const results = (await Promise.all(promises)).map((result) =>
    result.reduce((acc, count) => acc + count, 0)
  );

  const mem = await osu.mem.used();
  const embed = new MessageEmbed().addFields([
    { name: "OS", value: await osu.os.oos(), inline: true },
    {
      name: "CPU",
      value: [
        `Model: ${osu.cpu.model()}`,
        `Count: ${osu.cpu.count()}`,
        `Usage: ${await osu.cpu.usage()}%`,
      ].join("\n"),
      inline: true,
    },
    {
      name: "Memory",
      value: `${kilo(mem.usedMemMb)}G /${kilo(mem.totalMemMb)}G`,
      inline: true,
    },

    {
      name: "Shards",
      value: String(interaction.client.shard.count),
      inline: true,
    },
    { name: "Servers", value: String(results[0]), inline: true },
    { name: "Members", value: String(results[1]), inline: true },
    { name: "Streams", value: String(results[2]), inline: true },
  ]);
  return interaction.editReply({ embeds: [embed] });
};

const shard = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const promises = [
    interaction.client.shard.fetchClientValues("shard.ids"),
    interaction.client.shard.fetchClientValues("uptime"),
    interaction.client.shard.fetchClientValues("ws.ping"),
    interaction.client.shard.broadcastEval(
      (client) => client.manager.players.size
    ),
    interaction.client.shard.broadcastEval(
      (client) => client.manager.nodes.filter((node) => node.connected).size
    ),
  ];
  const results = await Promise.all(promises);

  const fields = [];
  for (let index = 0; index < results[0].length; index++) {
    fields.push({
      name: results[0][index].join(", "),
      value: [
        `Up Time: ${dayjs().millisecond(results[1][index]).fromNow(true)}`,
        `Ping: ${results[2][index]}`,
        `Players: ${results[3][index]}`,
        `Nodes: ${results[4][index]}`,
      ].join("\n"),
      inline: true,
    });
  }

  return interaction.editReply({
    embeds: chunk(fields, 25).map((fields) =>
      new MessageEmbed().addFields(fields)
    ),
  });
};
const node = (interaction) => {
  const fields = [];
  interaction.client.manager.nodes.forEach((node) => {
    if (!node.connected)
      return fields.push({
        name: `🔴 ${node.options.identifier}`,
        value: "?",
        inline: true,
      });

    fields.push({
      name: `🟢 ${node.options.identifier}`,
      value: [
        `Players: ${node.stats.players}`,
        `Up Time: ${dayjs().millisecond(node.stats.uptime).fromNow(true)}`,
        `CPU: ${Math.floor(node.stats.cpu.lavalinkLoad * 100)}%`,
        `Memory: ${giga(node.stats.memory.used)}G /${giga(
          node.stats.memory.allocated
        )}G`,
      ].join("\n"),
      inline: true,
    });
  });

  return interaction.reply({
    embeds: chunk(fields, 25).map((fields) =>
      new MessageEmbed().addFields(fields)
    ),
    ephemeral: true,
  });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("View bot info")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of information")
        .addChoices(["general", "shard", "node"].map((item) => [item, item]))
    ),
  execute(interaction) {
    const option = interaction.options.getString("type") || "general";

    switch (option) {
      default:
      case "general":
        return general(interaction);
      case "shard":
        return shard(interaction);
      case "node":
        return node(interaction);
    }
  },
};
