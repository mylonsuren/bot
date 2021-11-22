
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


var wikiCommand = function (msg, searchQuery) {
  const googleSearch = require("./googleSearch");
  
  var fromGoogle = false;
  var searchRequest = "";
  if (msg.content.includes("!wiki")) {
    searchRequest = msg.content.split("!wiki ")[1];
  } else if (msg.content.includes("!google")) {
    console.log("From google")
    fromGoogle = true;
    searchRequest = msg.content.split("!google ")[1];
  } else {
    searchRequest = msg;
  }

  var searchUrl = "";
  if (searchQuery) {
    searchUrl = `https://en.wikipedia.org/wiki/` + searchQuery;
  } else {
    searchUrl = `https://en.wikipedia.org/wiki/` + searchRequest;
  }
  
  return snekfetch.get(searchUrl).then((result) => {
    let $ = cheerio.load(result.text);
    msg.channel.send(searchUrl);
  }).catch((err) => {
    // msg.channel.send("No Wikipedia results for your query: *" + searchRequest + "*. \nBelow is the result of an attempted Google search.");
    if (!fromGoogle) {
      googleSearch(msg);
    } else {
      msg.channel.send("\nSorry, could not find any results for your search.");
      console.log(err);
    } 
  });
}

module.exports = wikiCommand;