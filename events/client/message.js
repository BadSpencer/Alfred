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
        this.client.log(`EVENT: message`, "debug");
        if (message.author.bot) return;
        message.settings = this.client.getSettings();

        if (message.channel.type === 'text') {
            await this.client.messageLog(message);
            this.client.memberLogText(message.author.id, message);
        };
    }
}

module.exports = MessageListener;