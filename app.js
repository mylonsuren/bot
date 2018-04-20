const discord = require('discord.js');
const request = require('request');
const fetch = require('isomorphic-fetch')
const express = require('express');
const http = require("http");
const auth = require("./data/auth.json");
const members = require("./data/members.json");
const other = require("./data/other.json");
const app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function (request, response) {
  var result = 'App is running';
  response.send(result);
})

app.get('/quit', function (req, res) {
  res.send('closing..');
  http.get("https://turtles-bot.herokuapp.com/");
})

app.listen(app.get('port'), function () {
  console.log('App is running, server is listening on port ', app.get('port'));

  const client = new discord.Client({
    token: auth.token,
    autorun: true
  });


  client.on('ready', () => {
    console.log('Client is ready.');
    client.user.setActivity('Fullmetal Alchemist', { type: 'WATCHING' })
      .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
      .catch(console.error);
  });

  client.on('message', message => {
    if (message.content.substring(0, 1) == '!') {
      var args = message.content.substring(1).split(' ');
      var cmd = args[0];
      switch (cmd) {
        case 'kick':
          kickUser(message);
          break;
        case 'anime':
          searchAnime(message);
          break;
        case 'name':
          changeName(message);
          break;
        case 'rt':
          rt(message);
          break;
        case 'add':
          inviteUser(message);
          break;
        case '?':
        case 'help':
          help(message);
      }
    }
  });

  client.login(auth.token);

  /**
   * Imitates the 'retweeting' of the mentioned
   * user's last message
   * @param {Message} message 
   */
  function rt(message) {
    const users = message.mentions.users;

    users.forEach(function (user) {
      const id = user.id;
      const member = message.guild.members.get(id);
      const lastMessage = member.lastMessage;

      message.channel.send({
        embed: {
          color: 3447003,
          author: {
            name: message.author.username,
            icon_url: message.author.avatarURL
          },
          title: member.username,
          description: lastMessage.content,
          timestamp: new Date(),
        }
      });

    });
  }

  /**
   * Outputs the list of commands for the bot
   * @param {Message} message 
   */
  function help(message) {
    message.channel.send({
      embed: {
        color: 3447003,
        title: "Command List",
        description: "Below are the list of commands for the bot.",
        fields: [
          {
            name: "***Remove User***",
            value: "!kick @Member"
          }, 
          {
            name: "**Change User Nickname***",
            value: "!name @Member newName"
          }, 
          {
            name: "***RT***",
            value: "!rt @Member"
          }, 
          {
            name: "***Find Anime***",
            value: "!anime animeTitle"
          }
        ],
      }
    })
  }

  function inviteUser(message) {
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

  function changeName(message) {
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

  function kickUser(message) {
    const users = message.mentions.users;
    users.forEach(function (user) {
      const id = user.id;
      const member = message.guild.members.get(id);
      if (user.username.toLowerCase() === members[0].names[0].toLowerCase()) {
        return;
      } else if (message.author.username.toLowerCase === members[3].names[0].toLowerCase()) {
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

  function dmUserKick(invite, member) {
    member.createDM()
      .then(channel => channel.send(invite.url))
      .catch(console.error)
  }

  function searchAnime(message) {
    var animeSearch = message.content.split("!anime ")[1];
    getRequest(animeSearch, message);
  }

  function composeMessageSuccess(list, message) {
    var response = "**" + list[0].title.romaji + "**";
    message.channel.send(response + "\n " + other.url2 + list[0].id)
  }


  function getRequest(value, message) {
    var query = `
      query ($id: Int, $page: Int, $perPage: Int, $search: String) {
        Page (page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          media (id: $id, search: $search) {
            id
            title {
              romaji
            }
          }
        }
      }`;

    var variables = {
      search: value,
      page: 1,
      perPage: 1
    };

    var url = other.url,
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          variables: variables
        })
      };

    fetch(url, options).then(handleResponse)
      .then(handleData)
      .catch(handleError);

    function handleResponse(response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    }

    function handleData(data) {
      var list = data.data;
      var text = list.Page.media;
      composeMessageSuccess(text, message);
    }

    function handleError(error) {
      console.error(error);
      message.channel.send(other.reply2);
    }
  }
});