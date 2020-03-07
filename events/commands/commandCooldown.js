const {
    Listener
} = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment');
const { errorMessage } = require('../../utils/messages');

class commandCooldownListener extends Listener {
    constructor() {
        super('commandCooldown', {
            emitter: 'commandHandler',
            eventName: 'commandCooldown'
        });
    }

    exec(message, command, remaining) {
        let client = this.client;

        errorMessage(client.textes.get("COMMAND_COOLDOWN_MESSAGE", command, remaining), message.channel);

    }
}

module.exports = commandCooldownListener;