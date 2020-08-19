const {
    Listener
} = require("discord-akairo");
const chalk = require('chalk');
const moment = require('moment');
const {
    errorMessage
} = require('../../utils/messages');

class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked'
        });
    }

    async exec(message, command, reason) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, 'debug');

        let guild;
        let blocked;
        let user;
        let raison;

        switch (reason) {
            case 'blacklist':
                raison = client.textes.get("COMMAND_BLOCKED_REASON_BLACKLIST");
                break;
            case 'userPermissions':
                raison = client.textes.get("COMMAND_BLOCKED_REASON_USERPERMISSIONS");
                break;
            case 'moderation':                
                raison = client.textes.get("COMMAND_BLOCKED_REASON_USERPERMISSIONS");
                break;
            case 'channel':
                raison = client.textes.get("COMMAND_BLOCKED_REASON_CHANNELS");
                break;
            case 'dm':
                raison = client.textes.get("COMMAND_BLOCKED_REASON_DM");
                break;
            default:
                raison = reason;
        }

        // Log 
        errorMessage(client.textes.get("COMMAND_BLOCKED_MESSAGE", command, raison), message.channel);
        client.log(client.textes.get("COMMAND_BLOCKED_MESSAGE", command, raison), "warn");
        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;






    }
}

module.exports = CommandBlockedListener;