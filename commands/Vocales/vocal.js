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
      channelName = "";

    };
    if (message.util.alias === 'edl') {
      
    };
    if (message.util.alias === 'fj') {
      
    };


    await client.core.createVoiceChannel(client);


  }

};

module.exports = VocalCommand;