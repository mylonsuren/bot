
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
 * Imitates the 'retweeting' of the mentioned
 * user's last message
 * @param {Message} message 
 */
var rt = function (message) {
  const users = message.mentions.users;

  users.forEach(function (user) {
    const id = user.id;
    const member = message.guild.members.get(id);
    const lastMessage = member.lastMessage;
    if (lastMessage === null) {
      message.channel.send("Sorry, unable to locate the last message sent by ***" + member.username + "***");
    } else {
      message.channel.send({
        embed: {
          color: 3447003,
          author: {
            name: lastMessage.author.username,
            icon_url: lastMessage.author.avatarURL
          },
          title: member.username,
          description: lastMessage.content,
          timestamp: new Date(),
        }
      });
    }

  });
}


module.exports = rt;