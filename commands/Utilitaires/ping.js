const {
    Command
} = require('discord-akairo');

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping', 'hello'],
            category: 'Utilitaires',
        });
    }

    exec(message) {
        message.delete();
        return message.util.send('Pong!').then(sent => {
            const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
            const text = `🔂\u2000**API Discord**: ${timeDiff} ms\n💟\u2000**Ping**: ${Math.round(this.client.ping)} ms`;
            return message.util.send(`Pong!\n${text}`);
        });

    }

}

module.exports = PingCommand;