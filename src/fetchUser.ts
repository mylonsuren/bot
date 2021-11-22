import { Client, User } from "discord.js";
import { Member } from "../interfaces/members";

/**
 * Fetch user from Discord
 * @param member
 * @returns User object promise
 */
const fetchUser = async (client: Client, member: Member): Promise<User> => {
	return await client.users.fetch(member.id);
};

export default fetchUser;