const {
  Command
} = require('discord-akairo');

class VocalCommand extends Command {
  constructor() {
    super('vocal', {
      aliases: ['vocal', 'salon', 'ce', 'edl', 'fj'],
      category: 'Vocales',
      args: [
        {
          id: 'nom'
        }]
    });
  }

  async exec(message, args) {
    let client = this.client;

    let channelName = "";
    if (message.util.alias === 'ce') {
      channelName = "🏰Casual Effect";
    };
    if (message.util.alias === 'edl') {
      channelName = "🌘 🎭 EDL-Rôle-Play";
    };
    if (message.util.alias === 'fj') {
      channelName = "🥶Tribu des Fjords";
    };

    if(args.nom) channelName = args.nom;


    await client.core.createVoiceChannel(client, channelName);

    message.delete();
  }

};

module.exports = VocalCommand;