const {
  Command
} = require('discord-akairo');

class StopCommand extends Command {
  constructor() {
    super('stop', {
      aliases: ['stop'],
      category: 'Vocales',
    });
  }

  async exec(message, args) {

    let client = this.client;
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    
    let channel = guild.channels.find(c => c.name === settings.AFKChannel);

    if (channel) {
      channel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          connection.disconnect();
        })
        .catch(console.log);
    }
  }
}

module.exports = StopCommand;