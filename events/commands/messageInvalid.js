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
            client.memberLogText(message.member.id, message);
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