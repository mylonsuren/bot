"use strict";
/**
 *
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const auth_json_1 = __importDefault(require("../data/auth.json"));
const members_json_1 = __importDefault(require("../data/members.json"));
// Discord Client
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
    ],
});
const updateRole = () => __awaiter(void 0, void 0, void 0, function* () {
    const MYLON_USER = yield fetchUser(members_json_1.default.Mylon);
    const TURTLES_GUILD = yield client.guilds.fetch("265297922789212160");
    const TURTLES_MEMBERS = yield TURTLES_GUILD.members.fetch();
    const MYLON_GUILD_MEMBER = TURTLES_MEMBERS.get("267790240092127232");
    console.log(MYLON_GUILD_MEMBER);
    console.log(MYLON_GUILD_MEMBER === null || MYLON_GUILD_MEMBER === void 0 ? void 0 : MYLON_GUILD_MEMBER.roles);
    MYLON_GUILD_MEMBER === null || MYLON_GUILD_MEMBER === void 0 ? void 0 : MYLON_GUILD_MEMBER.roles.add("571817867658526731").catch((e) => console.error(e));
});
/** EVENT LISTENERS */
// Client Ready
client.on("ready", () => {
    var _a;
    console.log("INFO: Discord Client Ready");
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setStatus("invisible");
    // client.user?.setActivity("Fullmetal Alchemist", {type: "WATCHING"});
    updateRole();
});
// Message Created
// client.on("messageCreate", (message: Message) => {
//     console.log("MESSAGE: Message Created");
//     // modUser();
// });
/**
 * Fetch user from Discord
 * @param member
 * @returns User object promise
 */
const fetchUser = (member) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client.users.fetch(member.id);
});
/**
 * Send direct embedded message to user
 * @param user User to receive message
 * @param title Title of message
 * @param content Content of message
 */
const sendDirectEmbedMessage = (user, title, content) => __awaiter(void 0, void 0, void 0, function* () {
    const EMBED = new discord_js_1.MessageEmbed()
        .setTitle(title)
        .setColor(0xb3000c)
        .setDescription(content);
    yield user.send({ embeds: [EMBED] });
    console.log(`INFO: Direct Embedded Message sent to ${user.username}...`);
});
client.login(auth_json_1.default.token);
