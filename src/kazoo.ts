import { Message } from "discord.js";
import { PRAT_KAZOO } from "../../data/censor.json";
import { VIDEOS } from "../../data/media.json";
import { sendReplyToMessage } from "./sendMessage";

export const replyPratKazooVideo = async (message: Message) => {
	const content = message.content;

	if (
		content.toLowerCase().includes(PRAT_KAZOO.key1) &&
		content.toLowerCase().includes(PRAT_KAZOO.key2)
	) {
		await sendReplyToMessage(
			message,
			VIDEOS.KAZOO.content,
			VIDEOS.KAZOO.path
		);
	}
};
