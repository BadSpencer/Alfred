const {
    Listener
} = require("discord-akairo");

class MessageInvalidListener extends Listener {
    constructor() {
        super('messageInvalid', {
            emitter: 'commandHandler',
            event: 'messageInvalid'
        });
    }

    async exec(message) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, 'debug');

        if (message.author.bot) return;

        if (message.channel.type === 'text') {
            await client.messageLog(message);
            if (message.content.length > 150) {
                client.db.userdataAddXP(client, message.member, 10, `Message 150+`);
            } else {
                client.db.userdataAddXP(client, message.member, 5, `Message`);
            }
        };

        let game = client.db_games.find(game => game.textChannelID == message.channel.id);
        if (game) {
            if (message.member.roles.cache.has(game.roleID)) {
                await client.usergameUpdateLastAction(game, message.member);
            };
        };

    };

}

module.exports = MessageInvalidListener;