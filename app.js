
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
    switch(cmd) {
      case 'kick' :
        kickUser(message);
        break;
    }
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
