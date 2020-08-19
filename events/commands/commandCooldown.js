const {
    Listener
} = require("discord-akairo");
const chalk = require('chalk');
const moment = require('moment');
const { errorMessage } = require('../../utils/messages');

class commandCooldownListener extends Listener {
    constructor() {
        super('commandCooldown', {
            emitter: 'commandHandler',
            event: 'commandCooldown'
        });
    }

    exec(message, command, remaining) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, 'debug');
        errorMessage(client.textes.get("COMMAND_COOLDOWN_MESSAGE", command, remaining), message.channel);
        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;
    }
}

module.exports = commandCooldownListener;