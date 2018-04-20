
const discord = require('discord.js');
const request = require('request');
const fetch = require('isomorphic-fetch')
const express = require('express');
const http = require("http");
const auth = require("../data/auth.json");
const members = require("../data/members.json");
const other = require("../data/other.json");
const app = express();


var client = null;

const inviteUser = function (message, platform) {
  client = platform;
  const user = message.content.split(" ")[1];
  message.channel.createInvite()
    .then(invite => getUser(message, user, invite))
    .catch(console.error)
}

function getUser(message, user, invite) {
  for (key in members) {
    var member = members[key];
    if (member.names.includes(user)) {
      client.fetchUser(member.id)
        .then(person => dmUser(person, invite, message))
        .catch(console.error);
      break;
    }
  }
}

function dmUser(user, invite, value) {
  user.send(invite.url)
    .then(message => console.log(`Sent message: ${message.content}`))
    .catch(error => dmUserError(error, user, value));
}

function dmUserError(error, user, message) {
  console.log(error);
  message.channel.send("Sorry, unable to invite ***" + user.username + "*** \nPlease create an invite manually.")
}


module.exports = inviteUser;