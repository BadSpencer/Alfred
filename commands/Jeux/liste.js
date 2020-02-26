const {
    Command
} = require('discord-akairo');

class ListeCommand extends Command {
    constructor() {
        super('liste', {
            aliases: ['liste', 'list', 'ls']
        });
    }

    exec(message) {
        let client = this.client;
        client.games.PostRoleReaction(client, true);
    }
}

module.exports = ListeCommand;