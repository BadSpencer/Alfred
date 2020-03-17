const {
    Command
} = require('discord-akairo');

class PlayCommand extends Command {
    constructor() {
        super('play', {
            aliases: ['play'],
            category: 'Vocales',
            cooldown: 30000,
            ratelimit: 1,
            args: [{
                id: "id"
            }, ]
        });
    }

    async exec(message, args) {
      let client = this.client;
      const settings = await client.db.getSettings(client);
        const youtube = require("ytdl-core");
        let argument = args.id;
        const streamOptions = {
          seek: 0,
          volume: 0.3
        };
      
        if (!argument) {
          argument = "sncf";
        }
      
        if (argument.startsWith("http") == true) {
      
          youtube.getInfo(String(argument), async function (err, info) {
            if (err) {
              //client.ShowError(err, message.channel);
            } else {
              client.log(client.textes.get("PLAY_LOG_YOUTUBE", message.member, argument, info.title), "debug");
            }
          });
      
          if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
              .then(connection => {
                const stream = youtube(String(argument), {
                  audioonly: true
                });
                const dispatcher = connection.playStream(stream, streamOptions);
                dispatcher.on("end", () => {
                  message.member.voiceChannel.leave();
                });
              })
              .catch(console.error);
          }
      
        } else {
      
          const file = settings.mediaPath + argument + ".mp3";
      
          if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
              .then(connection => {
                const dispatcher = connection.playFile(file, streamOptions);
                dispatcher.on("end", () => {
                  message.member.voiceChannel.leave();
                });
              })
              .catch(console.error);
          }
        }
        message.delete();
    }
}

module.exports = PlayCommand;