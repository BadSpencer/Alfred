const {
  Command
} = require('discord-akairo');

class VocalCommand extends Command {
  constructor() {
    super('vocal', {
      aliases: ['vocal', 'salon'],
      category: 'Vocales',
      args: [
        {
          id: 'nom'
        }],
      description: {
        content: 'Permet de recréer le salon vocal "+ Créer salon"',
        usage: '\`!vocal\`\n' +
        'C\'est rare, mais il m\'arrive d\'oublier de créer le salon "+ Créer salon". Cette commande vous permet de me le rappeler! Je viendrais tout de suite le créer.',
        examples: ['!vocal', '!salon']
      }
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

    if (args.nom) channelName = args.nom;


    await client.createVoiceChannel(channelName);

    if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;
  }

};

module.exports = VocalCommand;