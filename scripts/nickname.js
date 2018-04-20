
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
 * Changes the nickname of the mentioned user
 * @param {Message} message
 */
const changeName = function (message) {
  const users = message.mentions.users;

  users.forEach(function (user) {
    const id = user.id;
    const member = message.guild.members.get(id);
    const newName = message.content.split(" ");
    var name = newName[2];
    newName.forEach(function (word, index) {
      if (index >= 3) {
        name += " " + word;
      }
    });
    member.setNickname(name);
  });
}

module.exports = changeName;