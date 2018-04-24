
const discord = require('discord.js');
const request = require('request');
const fetch = require('isomorphic-fetch')
const express = require('express');
const http = require("http");
const auth = require("../data/auth.json");
const members = require("../data/members.json");
const other = require("../data/other.json");
const app = express();

/**
 * Removes the mentioned user from the server
 * @param {Message} message 
 */
const kickUser = function (message) {
  const users = message.mentions.users;
  users.forEach(function (user) {
    const id = user.id;
    const member = message.guild.members.get(id);
    if (user.username.toLowerCase() === members[0].names[0].toLowerCase()) {
      return;
    } else if (message.author.username.toLowerCase === members[3].names[0].toLowerCase()) {
      return;
    } else if ((message.author.id === members[1].id) && (user.username.toLowerCase() === members[0].names[0].toLowerCase())) {
      console.log("Aldrin attempt to remove Mylon");
      return;
    }

    if (!member.user.bot) {
      message.channel.createInvite()
        .then(invite => dmUserKick(invite, member))
        .catch(console.error);
    }

    member.kick()
      .then(() => message.channel.send((member.nickname === null ? user.username : member.nickname) + " was removed by " + message.author))
      .catch(() => {
        console.error;
        message.channel.send("Unable to remove ***" + (member.nickname === null ? user.username : member.nickname) + "***. \nPlease check your server settings.");
      });
  });
}

/**
 * DM's the removed user an invite link to the server
 * @param {Invite} invite 
 * @param {GuildMember} member 
 */
const dmUserKick = function (invite, member) {
  member.createDM()
    .then(channel => channel.send(invite.url))
    .catch(console.error)
}

module.exports = kickUser;