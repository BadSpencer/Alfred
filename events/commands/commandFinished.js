const {
    Listener
} = require("discord-akairo");

class CommandFinishedListener extends Listener {
    constructor() {
        super('commandFinished', {
            emitter: 'commandHandler',
            event: 'commandFinished',
        })
    }

    async exec(message, command) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, "debug");
        const guild = client.guilds.cache.get(client.config.guildID);

        let member = guild.members.cache.get(message.author.id);

        client.db.userdataAddXP(client, member, 5, `Commande`);

    }
};

module.exports = CommandFinishedListener;