const {
    Listener
} = require('discord-akairo');


class MessageReactionAddListener extends Listener {
    constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            eventName: 'messageReactionAdd'
        });
    }

    exec(messageReaction, user) {
        let reacted = `${user.id} à réagi sur le message ${messageReaction.message.id}` 
        this.client.logger.log(`${reacted}`);
    }
}

module.exports = MessageReactionAddListener;