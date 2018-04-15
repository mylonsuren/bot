
// discord-bot-test

const discord = require('discord.js');
const request = require('request');
const fetch = require('isomorphic-fetch')
const express = require('express');
var http = require("http");

var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});



setInterval(function() {
    http.get("https://turtles-bot.herokuapp.com/m");
}, 300000); // every 5 minutes (300000)


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


request('https://raw.githubusercontent.com/mylonsuren/practice/master/application.json', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var auth = JSON.parse(body);

    const client = new discord.Client({
      token: auth.token,
      autorun: true
    });

      
    client.on('ready', () => {
      console.log('Client is ready.');

    });

    client.on('message', message => {
    
      if (message.content.substring(0,1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        switch(cmd) {
          case 'kick' :
            kickUser(message);
            break;
          case 'search' : 
            searchAnime(message);
            break;
          default : 
            // message.channel.send('Invalid action.');
        }
      } else if (message.content.includes("nichijou")) {
        message.channel.send("smh")
      }
    });
    
    
    client.login(auth.token);
    
    function kickUser(message) {
      const users = message.mentions.users;
      users.forEach(function (user) {
        console.log(user);
        const id = user.id;
        const member = message.guild.members.get(id);
        if (user.username === auth.user) {
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

      message.channel.send(response + "\n https://anilist.co/anime/" + list[0].id)

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

      var url = 'https://graphql.anilist.co',
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
              console.log('https://myanimelist.net/anime/' + anime.id)
          });

          composeMessageSuccess(text, message);
      }

      function handleError(error) {
          console.error(error);

          message.channel.send("Sorry, could not find that anime.");

      }
    }


  }
})


