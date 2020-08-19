const {
    Command
} = require("discord-akairo");

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            category: 'Utilitaires',
            description: {
                content: 'Retourne le ping entre vous, le serveur et l\'API discord',
                usage: `\`!ping\`
                Je vous afficherais le temps que j\'ai mis pour répondre à votre commande (ping) ainsi que le temps qu\'il m\'aura fallut pour modifier ma réponse (temps de réponse API Discord).`,
                examples: ['!ping']
            }
        });
    }

    exec(message) {
        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();
        return message.util.send('Pong!').then(sent => {
            const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
            const text = `🔂\u2000**API Discord**: ${timeDiff} ms\n💟\u2000**Ping**: ${Math.round(this.client.ws.ping)} ms`;
            return sent.edit(`Pong!\n${text}`);
        });

    }

}

module.exports = PingCommand;