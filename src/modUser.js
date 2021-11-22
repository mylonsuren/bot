"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterMsg = void 0;
const filterJimmy_1 = require("./filter/filterJimmy");
const filterMsg = (message) => {
    const author = message.author;
    // if (
    // 	author.id === members.Jimmy.id &&
    // 	FILTER_LIST.some((word) => message.content.toLowerCase().includes(word))
    // ) {
    (0, filterJimmy_1.filterJimmy)(author, message);
    // }
};
exports.filterMsg = filterMsg;
// const modUser = (user: User, message: Message) => {};
