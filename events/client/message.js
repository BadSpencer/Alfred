const {
    Listener
} = require('discord-akairo');

class MessageListener extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            eventName: 'message'
        });
    }

    exec(message) {
        let client = this.client;

        if (message.author.bot) return;
    }
}

module.exports = MessageListener;