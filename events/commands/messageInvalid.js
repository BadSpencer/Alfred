const {
    Listener
} = require('discord-akairo');

class MessageInvalidListener extends Listener {
    constructor() {
        super('messageInvalid', {
            emitter: 'commandHandler',
            eventName: 'messageInvalid'
        });
    }

   async exec(message) {
        let client = this.client;

        if (message.author.bot) return;

        if (message.channel.type === 'text') {
            await client.messageLog(message);
            if (message.content.length > 150) {
                client.db.userdataAddXP(client, message.member, 10, `Message 150+`);
            } else {
                client.db.userdataAddXP(client, message.member, 5, `Message`);
            }
        }
    }
}

module.exports = MessageInvalidListener;