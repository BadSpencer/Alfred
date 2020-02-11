const {
    Listener
} = require('discord-akairo');

class MessageDeleteListener extends Listener {
    constructor() {
        super('messageDelete', {
            emitter: 'client',
            eventName: 'messageDelete'
        });
    }

    exec(message) {
        let deleted = `Le message ${message.id} à été supprimé dans le salon <#${message.channel.id}>` 
        this.client.logger.log(`${deleted}`);
    }
}

module.exports = MessageDeleteListener;