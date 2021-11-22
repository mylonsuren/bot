import { Client, Intents, Message } from "discord.js";
import auth from "../data/auth.json";

// Discord Client
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
});

// Client Ready
client.on("ready", () => {
	console.log("INFO: Discord Client Ready");

	client.user?.setStatus("dnd");
	client.user?.setActivity("Fullmetal Alchemist", { type: "WATCHING" });
});

// Message Created
client.on("messageCreate", (message: Message) => {
	console.log("MESSAGE: Message Created");
});

client.login(auth.token);
