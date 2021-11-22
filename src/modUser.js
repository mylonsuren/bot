"use strict";
/**
 *
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const members_json_1 = __importDefault(require("../data/members.json"));
const modUser = (user, message) => {
    if (user.id !== members_json_1.default.Jimmy.id) {
        return false;
    }
    const CONTENTS = message.content;
    const MENTIONS = message.mentions;
    return true;
};
