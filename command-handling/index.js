const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const dotenv = require("dotenv");
const { Manager } = require("erela.js");
const Spotify = require("better-erela.js-spotify").default;
const Filters = require("erela.js-filters");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});

client.manager = new Manager({
  plugins: [new Spotify(), new Filters()],
  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
})
  .on("nodeConnect", (node) =>
    console.log(`Node ${node.options.identifier} connected`)
  )
  .on("nodeError", (node, error) =>
    console.log(
      `Node ${node.options.identifier} had an error: ${error.message}`
    )
  )
  .on("trackStart", (player, track) => {
    client.channels.cache
      .get(player.textChannel)
      .send(`Now playing: ${track.title}`);
  })
  .on("queueEnd", (player) => {
    client.channels.cache.get(player.textChannel).send("Queue has ended.");

    player.destroy();
  });

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log("Ready!");
  client.manager.init(client.user.id);
});

client.on("raw", (d) => client.manager.updateVoiceState(d));

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

dotenv.config();
client.login(process.env.DISCORD_TOKEN);
