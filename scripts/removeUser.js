
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
    } else if (message.author.id === members[3].id) {
      return;
    } else if ((message.author.id === members[1].id) && (user.username.toLowerCase() === members[0].names[0].toLowerCase())) {
      return;
    }

    if (!member.user.bot) {
      console.log(member.user);
      message.channel.createInvite()
        .then(invite => dmUserKick(invite, member))
        .catch(console.error);
    }

    setTimeout(function () {
      member.kick()
        .then(() => message.channel.send((member.nickname === null ? user.username : member.nickname) + " was removed by " + message.author))
        .catch(() => {
          console.error;
          if (member.user.username === "test-bot") {
            message.channel.send("I can't remove myself from the chat.");
          } else {
            message.channel.send("Unable to remove ***" + (member.nickname === null ? user.username : member.nickname) + "***. \nPlease check your server settings.");
          }
        });
    }, 2000);

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
