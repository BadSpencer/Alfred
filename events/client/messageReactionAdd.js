const {
    Listener
} = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment');


class MessageReactionAddListener extends Listener {
    constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            eventName: 'messageReactionAdd'
        });
    }

    exec(messageReaction, user) {
        let timestamp = `${moment(new Date()).format("DD-MM-YY HH:mm:ss")}`;
        let reacted = `${user.id} à réagi sur le message ${messageReaction.message.id}` 
        console.log(`${timestamp} | ${reacted}`);
    }
}

module.exports = MessageReactionAddListener;