
const discord = require('discord.js');
const request = require('request');
const fetch = require('isomorphic-fetch')
const express = require('express');
const http = require("http");
const auth = require("../data/auth.json");
const members = require("../data/members.json");
const other = require("../data/other.json");
const app = express();


const searchAnime = function (message) {
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

module.exports = searchAnime;