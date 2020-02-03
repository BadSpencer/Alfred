const {
    Listener
} = require('discord-akairo');

class CommandFinishedListener extends Listener {
    constructor() {
        super('commandFinished', {
            emitter: 'commandHandler',
            eventName: 'commandFinished',
        })
    }

    exec(message, command) {
        if (message.channel.type === 'text') {
            message.delete(5000);
        }
    }
};

module.exports = CommandFinishedListener;