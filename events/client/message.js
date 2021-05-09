const {
    Listener
} = require("discord-akairo");

class MessageListener extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(message) {
        client.log(`EVENT: message`, "debug");
        if (message.author.bot) return;
        message.settings = this.client.getSettings();
    }
}

module.exports = MessageListener;