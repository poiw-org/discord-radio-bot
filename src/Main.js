const Eris = require('eris');
const IceParser = require('./IceParser');
const config = require('../config.json');

// print logo
require('./Logo');

// inject ffmpeg
require('ffmpeg-inject');

const client = new Eris.Client(config.discord.token);
// connect client
client.connect();

// register err event listener
client.on("error", err =>  process.exit(1));

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

    // start ice parser
    let radio = new IceParser(config.radio.stream);
    console.log(`[Info]`, `Awaiting data...`);

    // apply title data
    radio.on('title', title => {
      console.log(`[Info]`, `Now playing: ${title}`);
      client.editStatus("online", { name: title, type: 2 })
    });

    // play stream data
    radio.on('stream', stream => {
      // start stream and set volume
      connection.play(stream, { 
        // inlineVolume: false,
        // // format: "webm",
        // samplingRate: 20000
      });
    });


    // display errors
    radio.on('error', err => process.exit(1));
    radio.on('end', err => process.exit(1));
    radio.on('disconnect', err => process.exit(1));

  });
});