const {
    Command
} = require('discord-akairo');

class ListeCommand extends Command {
    constructor() {
        super('liste', {
            aliases: ['liste', 'list', 'ls'],
            enabled: false,
            category: 'Admin',
        });
    }

    exec(message) {
        let client = this.client;
        client.games.PostRoleReaction(client, true);

        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;;
    }
}

module.exports = ListeCommand;