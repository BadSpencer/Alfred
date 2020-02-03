const {
    Listener
} = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment');


class MessageDeleteListener extends Listener {
    constructor() {
        super('messageDelete', {
            emitter: 'client',
            eventName: 'messageDelete'
        });
    }

    exec(message) {
        let timestamp = `${moment(new Date()).format("DD-MM-YY HH:mm:ss")}`;
        let deleted = `Le message ${message.id} à été supprimé dans le salon <#${message.channel.id}>` 
        console.log(`${timestamp} | ${deleted}`);
    }
}

module.exports = MessageDeleteListener;