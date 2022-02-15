const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const dotenv = require("dotenv");
const { Manager } = require("erela.js");
const Spotify = require("better-erela.js-spotify").default;
const Filters = require("erela.js-filters");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
  ws: { properties: { $os: "Android", $browser: "Discord Android" } },
});

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

dotenv.config();
client.manager = new Manager({
  plugins: [new Spotify(), new Filters()],
  nodes: [{ host: process.env.LAVALINK_HOST }],
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
  .on("trackStart", (player, track) =>
    client.guilds.cache
      .get(player.guild)
      .me.setNickname(track.title.substring(0, 32))
  )
  .on("queueEnd", (player) => player.disconnect())
  .on("socketClosed", (player, payload) => {
    if (!payload.byRemote) return;
    player.destroy();

    const guild = client.guilds.cache.get(player.guild);
    if (guild.available) guild.me.setNickname(null);
  });

client.on("raw", (d) => client.manager.updateVoiceState(d));
client.login(process.env.DISCORD_TOKEN);
