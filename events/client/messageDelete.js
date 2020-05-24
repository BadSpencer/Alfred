const {
    Listener
} = require('discord-akairo');

class MessageDeleteListener extends Listener {
    constructor() {
        super('messageDelete', {
            emitter: 'client',
            event: 'messageDelete'
        });
    }

    exec(message) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, 'debug');

        if (message.author == null) return client.log(`Message supprimé mais il n\'est plus disponible`, 'debug');
        if (message.author.bot) return; // On ne log pas les suppr de messages de bot
        if (message.content.startsWith("!")) return; // On ne log pas les suppr de commandes

        let deleted = `Le message ${message.id} à été supprimé dans le salon <#${message.channel.id}>`
        client.log(`${deleted}`);

        if (client.db_postedEmbeds.has(message.id)) this.client.db_postedEmbeds.delete(message.id);
    }
}

module.exports = MessageDeleteListener;