
const cheerio = require('cheerio');
const snekfetch = require('snekfetch');
const querystring = require('querystring');

const discord = require('discord.js');
const request = require('request');
const fetch = require('isomorphic-fetch')
const express = require('express');
const http = require("http");
const auth = require("../data/auth.json");
const members = require("../data/members.json");
const other = require("../data/other.json");
const app = express();

const google = require("./googleSearch");

var wikiCommand = function (msg) {

  const searchRequest = msg.content.split("!wiki ")[1];
  var searchUrl = `https://en.wikipedia.org/wiki/` + searchRequest;

  return snekfetch.get(searchUrl).then((result) => {
    let $ = cheerio.load(result.text);
    msg.channel.send(searchUrl);
  }).catch((err) => {
    msg.channel.send("No Wikipedia results for your query: *" + searchRequest + "*. \nBelow is the result of an attempted Google search.");
    google(msg);
    console.log(err);
  });
}

module.exports = wikiCommand;