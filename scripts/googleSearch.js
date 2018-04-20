

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


var googleCommand = function (msg) {

  const searchRequest = msg.content.split("!google ")[1];
  console.log(searchRequest);

  let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchRequest)}`;

  return snekfetch.get(searchUrl).then((result) => {
    let $ = cheerio.load(result.text);
    let googleData = $('.r').first().find('a').first().attr('href');
    googleData = querystring.parse(googleData.replace('/url?', ''));
    console.log(googleData);

    msg.channel.send(googleData.q);
    if (googleData['https://maps.google.com/maps?um']) {
      var searchMap = searchRequest.replace(" ", "+");
      msg.channel.send('https://www.google.com/maps/search/?api=1&query=' + searchMap);
    }


  }).catch((err) => {
    msg.channel.send("No results found for your search: *" + searchRequest + "*");
    console.log(err);
  });
}

module.exports = googleCommand;