const {
    Listener
} = require("discord-akairo");

class CommandFinishedListener extends Listener {
    constructor() {
        super('commandFinished', {
            emitter: 'commandHandler',
            event: 'commandFinished',
        })
    }

    async exec(message, command) {
        let client = this.client;

        client.commandLog(message, command);
        client.memberLogCmd(message.author.id);

    }
};

module.exports = CommandFinishedListener;