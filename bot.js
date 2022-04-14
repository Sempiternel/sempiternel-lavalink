const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const dotenv = require('dotenv');
const { Manager } = require('erela.js');
const Filters = require('erela.js-filters');
const { default: AppleMusic } = require('better-erela.js-apple');
const { default: Spotify } = require('better-erela.js-spotify');
const Deezer = require('erela.js-deezer');
dotenv.config();

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MESSAGES,
	],
	ws: { properties: { $os: 'Android', $browser: 'Discord Android' } },
});

client.manager = new Manager({
	plugins: [new Filters(), new AppleMusic(), new Spotify(), new Deezer()],
	nodes: [],
	send(id, payload) {
		const guild = client.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	},
});

client.commands = new Collection();
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const eventFiles = fs
	.readdirSync('./events')
	.filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) client.once(event.name, (...args) => event.execute(...args));
	else client.on(event.name, (...args) => event.execute(...args));
}

const eventManagerFiles = fs
	.readdirSync('./events_manager')
	.filter((file) => file.endsWith('.js'));
for (const file of eventManagerFiles) {
	const event = require(`./events_manager/${file}`);
	client.manager.on(event.name, (...args) => event.execute(client, ...args));
}

client.on('raw', (d) => client.manager.updateVoiceState(d));
client.login(process.env.DISCORD_TOKEN);
