"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const discord_js_1 = require("discord.js");
const auth_json_1 = __importDefault(require("../data/auth.json"));
const filter_1 = require("./filter/filter");
const kazoo_1 = require("./kazoo");
// Discord Client
exports.client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
    ],
});
// Client Ready
exports.client.on("ready", () => {
    var _a;
    console.log("INFO: Discord Client Ready");
    (_a = exports.client.user) === null || _a === void 0 ? void 0 : _a.setStatus("online");
    // client.user?.setActivity("Fullmetal Alchemist", { type: "WATCHING" });
});
// Message Created
exports.client.on("messageCreate", (message) => {
    console.log("MESSAGE: Message Created");
    (0, filter_1.filterMsg)(message);
    (0, kazoo_1.replyPratKazooVideo)(message);
});
exports.client.login(auth_json_1.default.token);
