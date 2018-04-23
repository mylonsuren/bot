

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

const wiki = require('./wiki');

var googleCommand = function (msg) {

  var searchRequest = "";
  if (msg.content.includes('!google')) {
    searchRequest = msg.content.split("!google ")[1];
  } else if (msg.content.includes('!wiki')) {
    searchRequest = msg.content.split("!wiki ")[1];
  } else {
    searchRequest = msg;
  }
  
  var searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchRequest)}`;

  return snekfetch.get(searchUrl).then((result) => {
    let $ = cheerio.load(result.text);
    let googleData = $('.r').first().find('a').first().attr('href');
    googleData = querystring.parse(googleData.replace('/url?', ''));
    var searchMap = searchRequest.replace(" ", "+");
    if (googleData['https://maps.google.com/maps?um']) {
      msg.channel.send('***' + googleData.q + "***");
      msg.channel.send('https://www.google.com/maps/search/?api=1&query=' + searchMap);
    } else if (googleData.q) {
      console.log(googleData);
      msg.channel.send(googleData.q);
    } else if (googleData['/search?q']) {
      console.log("Checking wikipedia...")
      const searchTerm = googleData['/search?q'];
      wiki(msg, googleData['/search?q']);
    } else {
      console.log(googleData);
      msg.channel.send("No results found for your search: *" + searchRequest + "*");
    }
  }).catch((err) => {
    msg.channel.send("No results found for your search: *" + searchRequest + "*");
    console.log(err);
  });
}

module.exports = googleCommand;