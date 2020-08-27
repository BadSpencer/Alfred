const {
  Command
} = require("discord-akairo");

class StopCommand extends Command {
  constructor() {
    super('stop', {
      aliases: ['stop'],
      category: 'Vocales',
      description: {
        content: 'Arrête la lecture en cours',
        usage: `\`!stop\`
        La musique qui passe actuellement dans votre salon vous casse les oreilles ? Lancez cette commande et j'arrêterais tout !`,
        examples: ['!stop']
      }
    });
  }

  async exec(message, args) {

    let client = this.client;
    const guild = client.guilds.cache.get(client.config.guildID);
    const settings = client.getSettings();
    
    let channel = guild.channels.cache.find(c => c.name === settings.AFKChannel);

    if (channel) {
      channel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          connection.disconnect();
        })
        .catch(console.log);
    }
    if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;
  }
}

module.exports = StopCommand;