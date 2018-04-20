

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
  // console.log(searchRequest);
  
  var searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchRequest)}`;

  return snekfetch.get(searchUrl).then((result) => {
    let $ = cheerio.load(result.text);
    let googleData = $('.r').first().find('a').first().attr('href');
    googleData = querystring.parse(googleData.replace('/url?', ''));
    // console.log(googleData);
    var searchMap = searchRequest.replace(" ", "+");
    if (googleData['https://maps.google.com/maps?um']) {
      msg.channel.send('***' + googleData.q + "***");
      msg.channel.send('https://www.google.com/maps/search/?api=1&query=' + searchMap);
    } else if (googleData.q) {
      msg.channel.send(googleData.q);
    } else {
      // autocorrectSearch(googleData['/search?q'], msg.channel);
      msg.channel.send("*Try searching for: " + googleData['/search?q'] + "*");
    }


  }).catch((err) => {
    msg.channel.send("No results found for your search: *" + searchRequest + "*");
    console.log(err);
  });
}

// var autocorrectSearch = function(newMessage, channel) {
//   const searchRequest = newMessage;
//   console.log(searchRequest);
  
//   var searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchRequest)}`;

//   return snekfetch.get(searchUrl).then((result) => {
//     let $ = cheerio.load(result.text);
//     let googleData = $('.r').first().find('a').first().attr('href');
//     googleData = querystring.parse(googleData.replace('/url?', ''));
//     console.log(googleData);
//     var searchMap = searchRequest.replace(" ", "+");
//     if (googleData['https://maps.google.com/maps?um']) {
//       channel.send('***' + googleData.q + "***");
//       channel.send('https://www.google.com/maps/search/?api=1&query=' + searchMap);
//     } else if (googleData.q) {
//       channel.send(googleData.q);
//     } else {
//       channel.send("No results found for your search: *" + searchRequest + "*");
//     }

//   }).catch((err) => {
//     channel.send("No results found for your search: *" + searchRequest + "*");
//     console.log(err);
//   });
// }

module.exports = googleCommand;