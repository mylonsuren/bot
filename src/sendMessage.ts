import { MessageEmbed, User } from "discord.js";

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
