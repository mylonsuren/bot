import { Message } from "discord.js";
import { VIDEOS } from "../data/media.json";
import members from "../data/members.json";
import { sendReplyToMessage } from "./sendMessage";

export const replyPratKazooVideo = async (message: Message) => {
	const content = message.content;

	if (
		content.toLowerCase().includes("prat") &&
		content.toLowerCase().includes("dumb") &&
		message.author.id === members.Mylon.id
	) {
		await sendReplyToMessage(
			message,
			VIDEOS.KAZOO.content,
			VIDEOS.KAZOO.path
		);
	}
};
