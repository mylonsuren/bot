import {
	Message,
	MessageAttachment,
	MessageEmbed,
	MessageOptions,
	User,
} from "discord.js";

/**
 * Send direct embedded message to user
 * @param user User to receive message
 * @param title Title of message
 * @param content Content of message
 */
export const sendDirectEmbedMessage = async (
	user: User,
	title: string,
	content: string
) => {
	const EMBED = new MessageEmbed()
		.setTitle(title)
		.setColor(0xb3000c)
		.setDescription(content);

	await user.send({ embeds: [EMBED] });
	console.log(`INFO: Direct Embedded Message sent to ${user.username}...`);
};

/**
 * Replies to message with the attached file
 * @param message 
 * @param content 
 * @param path 
 */
export const sendReplyToMessage = async (
	message: Message,
	content: string,
	path: string
) => {
	const ATTACHEMENT = new MessageAttachment(path);

	const REPLY: MessageOptions = {
		content: content,
		embeds: [],
		files: [ATTACHEMENT],
	};

	message.reply(REPLY);
};
