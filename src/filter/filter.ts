import { Message, User } from "discord.js";
import { filterJimmy } from "./filterJimmy";
import members from "../../data/members.json";

export const filterMsg = (message: Message) => {
	const author: User = message.author;

	if (author.id === members.Mylon.id) {
		filterJimmy(message);
	}
};
