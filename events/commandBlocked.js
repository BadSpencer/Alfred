const {
    Listener
} = require('discord-akairo');

class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            eventName: 'commandBlocked'
        });
    }

    exec(message, command, reason) {
        console.log(`Commande ${command.id} bloquée pour ${message.author.username} (raison: ${reason})`);
    }
}

module.exports = CommandBlockedListener;