import { Message } from "discord.js";
import { PRAT_KAZOO } from "../../data/censor.json";
import { VIDEOS } from "../../data/media.json";
import { sendReplyToMessage } from "./sendMessage";

export const replyPratKazooVideo = async (message: Message) => {
	const content = message.content.toLowerCase()

	const mandatoryWords: Array<string> = PRAT_KAZOO.mandatory;
	const optionalWords: Array<string> = PRAT_KAZOO.optional;

	if (
		mandatoryWords.every((word: string) => content.includes(word)) &&
		optionalWords.some((word: string) => content.includes(word))
	) {
		await sendReplyToMessage(
			message,
			VIDEOS.KAZOO.content,
			VIDEOS.KAZOO.path
		);
	}
};
