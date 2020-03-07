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

  async exec(message) {
        let client = this.client;
        if (message.author.bot) return;

        message.settings = await client.db.getSettings(client);
    }
}

module.exports = MessageListener;