const fs = require("fs");
const { Client, Collection, Intents, Permissions } = require("discord.js");
const dotenv = require("dotenv");
const { Manager } = require("erela.js");
const Filters = require("erela.js-filters");
const Spotify = require("better-erela.js-spotify").default;
const Deezer = require("erela.js-deezer");
const { default: axios } = require("axios");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
  ws: { properties: { $os: "Android", $browser: "Discord Android" } },
  presence: { status: "dnd" },
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

const checkNode = () => {
  const nodes = client.manager.nodes.filter((node) => node.connected).size;
  const presence = {
    status: "online",
    activities: [
      {
        name: `${nodes} nodes | shards ${client.shard.ids.toString()}`,
        type: "WATCHING",
      },
    ],
  };

  if (!client.manager.leastUsedNodes.first()) presence.status = "idle";
  client.user.setPresence(presence);
};

axios
  .get("https://lavalink.darrennathanael.com/api/servers.json")
  .then((json) => {
    json.data.ssl = json.data.ssl.map((node) => {
      return { secure: true, ...node };
    });
    json.data.nossl = json.data.nossl.map((node) => {
      return { secure: false, ...node };
    });
    const nodes = json.data.ssl.concat(json.data.nossl).map((node) => {
      return { ...node, port: Number(node.port) };
    });

    client.manager = new Manager({
      plugins: [new Filters(), new Spotify(), new Deezer()],
      nodes,
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    })
      .on("nodeConnect", (node) => {
        console.log(`Node ${node.options.identifier} connected`);
        checkNode();
      })
      .on("nodeDisconnect", (node) => {
        console.log(`Node ${node.options.identifier} disconnected`);
        checkNode();
      })
      .on("nodeError", (node, error) =>
        console.log(
          `Node ${node.options.identifier} had an error: ${error.message}`
        )
      )
      .on("trackStart", (player, track) => {
        const guild = client.guilds.cache.get(player.guild);
        if (guild.me.permissions.has(Permissions.FLAGS.CHANGE_NICKNAME))
          guild.me.setNickname(track.title.substring(0, 32));
      })
      .on("queueEnd", (player) => player.disconnect())
      .on("socketClosed", (player, payload) => {
        if (!payload.byRemote) return;
        player.destroy();

        const guild = client.guilds.cache.get(player.guild);
        if (!guild) return;
        if (guild.me.permissions.has(Permissions.FLAGS.CHANGE_NICKNAME))
          guild.me.setNickname(null);
      });

    client.on("raw", (d) => client.manager.updateVoiceState(d));

    dotenv.config();
    client.login(process.env.DISCORD_TOKEN);
  });
