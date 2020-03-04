const {
  Command
} = require('discord-akairo');

class VocalCommand extends Command {
  constructor() {
    super('vocal', {
      aliases: ['vocal', 'salon'],
      category: 'Vocales'
    });
  }

  async exec(message, args) {
    let client = this.client;

    await client.core.createFreeVoiceChannel(client);

  }

};

module.exports = VocalCommand;