import { FILTER_LIST } from "../../../data/censor.json";
import { Message } from "discord.js";
import _ from "lodash";

export const filterJimmy = async (message: Message) => {
	let content = message.content;

	_.forOwn(FILTER_LIST, (replacement: string, key: string) => {
		console.log(`key: ${key}`);
		console.log(`replacement: ${replacement}`);

		content = content.replaceAll(key, replacement);
	});

	console.log(`New Message: ${content}`);

	// Figure out what to do ...
    // Discord API will not allow editing of messages authored by other users,
    // can maybe send a reply.
};
