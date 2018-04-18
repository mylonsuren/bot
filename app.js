
// discord-bot-test

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
}).listen(app.get('port'), function () {
  console.log('App is running, server is listening on port ', app.get('port'));
});

const client = new discord.Client({
  token: auth.token,
  autorun: true
});


client.on('ready', () => {
  console.log('Client is ready.');
});

client.on('message', message => {

  if (message.content.substring(0, 1) == '!') {
    var args = message.content.substring(1).split(' ');
    var cmd = args[0];
    switch (cmd) {
      case 'kick':
        kickUser(message);
        break;
      case 'search':
        searchAnime(message);
        break;
      case 'name':
        changeName(message);
        break;
      case 'invite' :
        inviteUser(message);
      default:
      // message.channel.send('Invalid action.');
    }
  } else if (message.content.toLowerCase().includes(other.n)) {
    message.channel.send(other.reply1);
  }
});


client.login(auth.token);

function inviteUser(message) {
  const user = message.content.split(" ")[1];
  console.log(user);

  console.log(message.guild.members);

  message.channel.createInvite()
    .then(invite => getUser(message, user, invite))
    .catch(console.error)
  

}

function getUser(message, user, invite) {
  for (key in members) {
    var member = members[key];
    console.log(member);
    console.log(user);
    if (member.names.includes(user)) {
      console.log((member.id));
      // console.log(client.fetchUser(member.id));
      client.fetchUser(member.id)
        .then(user => console.log(user))
        .catch(console.error);
    }
  }
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
    console.log(user);
    const id = user.id;
    const member = message.guild.members.get(id);
    if (user.username.toLowerCase() === members[0].names[0].toLowerCase()) {
      return;
    }
    member.kick();
    console.log(message.author.username);
    message.channel.send(user.username + " was removed by " + message.author);
  });
}

function searchAnime(message) {
  var animeSearch = message.content.split("!search ")[1];
  console.log(animeSearch);
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
    text.forEach(function (anime) {
      console.log(anime.id);
    });

    composeMessageSuccess(text, message);
  }

  function handleError(error) {
    console.error(error);

    message.channel.send(other.reply2);

  }
}
