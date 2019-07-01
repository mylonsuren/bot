
// Dependencies
const discord = require('discord.js');
const request = require('request');
const fetch = require('isomorphic-fetch')
const express = require('express');
const http = require("http");
const app = express();

// Data
const auth = require("./data/auth");
const members = require("./data/members");
const other = require("./data/other");

// Scripts
const rt = require('./scripts/rt');
const removeUser = require('./scripts/removeUser');
const changeName = require('./scripts/nickname');
const help = require('./scripts/help');
const invite = require('./scripts/invite');
const find = require('./scripts/find');
const googleSearch = require('./scripts/googleSearch');
const wiki = require('./scripts/wiki');

app.set('port', (process.env.PORT || 5000));

app.get('/', function (request, response) {
  var result = 'App is running';
  response.send(result);
})

app.listen(app.get('port'), function () {
  console.log('App is running, server is listening on port ', app.get('port'));
  const client = new discord.Client({
    token: auth.token,
    autorun: true
  });


  client.on('ready', () => {
    console.log('Client is ready.');
    // client.user.setActivity('Fullmetal Alchemist', { type: 'WATCHING' })
    //   .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
    //   .catch(console.error);
  });

  client.on('guildMemberUpdate', member => {
    console.log("guild member update");
  });

  client.on('guildUpdate', (oldGuild, newGuild) => {
    console.log('guild update');
  });

  // Used for creating and sending invite for removed user,
  // temporarily removed
  client.on('guildMemberRemove', member => {
    // client.channels.get("265297922789212160").createInvite()
    //     .then(invite => {
    //       member.createDM()
    //         .then(channel => channel.send(invite.url))
    //         .catch(console.error)
    //     })
    //     .catch(console.error)
  });

  client.on('channelUpdate', (oldChannel, newChannel) => {
    console.log('channel update');

    if (oldChannel.name != newChannel.name) {
      newChannel.send("Channel name was changed to ***" + newChannel.name + "***");
    }

  });

  client.on('message', message => {

    if (message.content.substring(0, 1) == '!') {
      var args = message.content.substring(1).split(' ');
      var cmd = args[0];
      switch (cmd) {
        case 'wiki':
          wiki(message);
          break;
        case 'kick':
          removeUser(message);
          break;
        case 'anime':
          find(message);
          break;
        case 'name':
          changeName(message);
          break;
        case 'rt':
          rt(message);
          break;
        case 'add':
          invite(message, client);
          break;
        case 'google':
          googleSearch(message);
          break;
        case '?':
        case 'help':
          help(message);
      }
    } else if (message.author.id == members[3].id) {
      console.log("Jimmy sent a message.");
      const member = message.guild.members.get(members[3].id);
      const users = message.mentions.users;

      // Handle Tags from User

      if (message.mentions.users.size > 0) {
        console.log("Message contains tags.")
  
        const mentionedUsers = message.mentions.users;

        mentionedUsers.forEach(function (user) {
          const username = user.username;
          console.log(username);
        });

        member.kick()
          .then(() => console.log("Jimmy removed for mentioning user"))
          .catch(() => {
            console.error;
          });
  
      }

      // if (message.content.includes('KappaPride') || message.content.includes('ur mom') || message.content.includes('rathika') || message.content.includes('Rathika') ||
      //   message.content.includes('ur mudda') || message.content.includes('set') || message.content.includes('$et') ||
      //   message.content.includes('mom') || message.content.includes('mother') || message.content.includes('mama')) {
      //   member.kick()
      //     .then(() => console.log("Jimmy removed himself."))
      //     .catch(() => {
      //       console.error;
      //     });
      // } else {
      //   users.forEach(function (user) {
      //     if (user.id == members[1].id || user.id == members[0].id) {
      //       console.log("user mentioned resulted in removal");
      //       member.kick()
      //         .then(() => console.log("Jimmy removed by mentioning another user"))
      //         .catch(() => console.error)
      //     }
      //   });
      // }
    }

  });

  client.login(auth.token);
});