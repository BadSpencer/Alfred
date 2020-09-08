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
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (message.author.bot) return;
        if (message.channel.name === settings.commandsChannel) return;
        // if (message.channel.name === settings.commandsTestChannel) return;

        if (message.channel.type === 'text') {
            await client.messageLog(message);
            client.memberLogText(message.author.id, message);
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