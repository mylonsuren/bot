
// discord-bot-test

var Discord = require('discord.js');
var auth = require('./auth.json');


const client = new Discord.Client({
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
    console.log("CMD : " + cmd);

    switch(cmd) {
      case 'ping' :
        message.channel.send('Pong!');
        break;
      default : 
        message.channel.send('Invalid message');
    }
  }
});


client.login(auth.token);


