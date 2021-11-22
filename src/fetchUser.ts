import { Member } from "../interfaces/members";
import { User } from "discord.js";
import { client } from "./index";

/**
 * Fetch user from Discord
 * @param member
 * @returns User object promise
 */
export const fetchUserByMember = async (member: Member): Promise<User> => {
	return await client.users.fetch(member.id);
};

/**
 * Fetch user from Discord
 * @param id
 * @returns User object promise
 */
export const fetchUserByID = async (id: string): Promise<User> => {
	return await client.users.fetch(id);
};
