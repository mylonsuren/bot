import { Client, Intents, Message } from "discord.js";
import auth from "../data/auth.json";
import { filterMsg } from "./filter/filter";
import { replyPratKazooVideo } from "./kazoo";

// Discord Client
export const client = new Client({
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

	client.user?.setStatus("online");
	// client.user?.setActivity("Fullmetal Alchemist", { type: "WATCHING" });
});

// Message Created
client.on("messageCreate", (message: Message) => {
	console.log("MESSAGE: Message Created");

	filterMsg(message);
    replyPratKazooVideo(message);
});

client.login(auth.token);
