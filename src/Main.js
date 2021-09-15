const Eris = require('eris');
const config = require('../config.json');

// print logo
require('./Logo');

// inject ffmpeg
require('ffmpeg-inject');

const client = new Eris.Client(config.discord.token);
// connect client
client.connect();

// register err event listener
client.on("error", err => console.error(`[Error]`, `Unexpected error: ${err}`));

// register ready event listener
client.once("ready", () => {
  console.log(`[Info]`, `Client connection to Discord established.`);

  // target server
  let server = client.guilds.values().next().value;
  console.log(`[Info]`, `Server: ${server.name} (${server.id})`);

  // target channel
  let channel = server.channels.get(config.discord.channel);
  console.log(`[Info]`, `Channel: ${channel.name} (${channel.id})`);

  // connect to channel
  channel.join().then(connection => {
    play(connection)
    connection.on("end", ()=>play(connection))
  })

});

const play = connection =>{
  connection.play('./file.mp3', { inlineVolume: true });
  connection.setVolume(config.radio.volume / 100);
  return connection;
}