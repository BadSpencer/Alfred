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
        client.log(`EVENT: ${this.emitter}/${this.event}`, "debug");

        if (message.author.bot) return;

        if (message.channel.type === 'text') {
            await client.messageLog(message);
            if (message.content.length > 150) {
                client.userdataAddXP(message.member, "TEXT", 20);
            } else {
                client.userdataAddXP(message.member, "TEXT", 10);
            }
        };

        let games = client.db_games.filterArray((game) => game.textChannelID == message.channel.id);
        for (const game of games) {
            if (message.member.roles.cache.has(game.roleID)) {
                await client.usergameUpdateLastAction(game, message.member);
            };
        };
    };

}

module.exports = MessageInvalidListener;