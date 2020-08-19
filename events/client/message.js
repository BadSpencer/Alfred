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
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, 'debug');
        if (message.author.bot) return;

        message.settings = await client.db.getSettings(client);
    }
}

module.exports = MessageListener;