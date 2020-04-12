const {
    Listener
} = require('discord-akairo');

class CommandFinishedListener extends Listener {
    constructor() {
        super('commandFinished', {
            emitter: 'commandHandler',
            eventName: 'commandFinished',
        })
    }

    async exec(message, command) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);

        let member = guild.members.get(message.author.id);

        client.db.userdataAddXP(client, member, 20, `Commande`);

    }
};

module.exports = CommandFinishedListener;