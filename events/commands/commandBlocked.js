const {
    Listener
} = require("discord-akairo");
const chalk = require('chalk');
const moment = require('moment');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
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
        client.log(`EVENT: ${this.emitter}/${this.event}`, "debug");

        let guild;
        let blocked;
        let user;
        let raison;

        switch (reason) {
            case 'blacklist':
                raison = client.textes.get("COMMAND_BLOCKED_REASON_BLACKLIST");
                errorMessage(client.textes.get("COMMAND_BLOCKED_MESSAGE", command, raison), message.channel);
                message.delete();
                break;
            case 'userPermissions':
                raison = client.textes.get("COMMAND_BLOCKED_REASON_USERPERMISSIONS");
                errorMessage(client.textes.get("COMMAND_BLOCKED_MESSAGE", command, raison), message.channel);
                message.delete();
                break;
            case 'moderation':                
                raison = client.textes.get("COMMAND_BLOCKED_REASON_USERPERMISSIONS");
                errorMessage(client.textes.get("COMMAND_BLOCKED_MESSAGE", command, raison), message.channel);
                message.delete();
                break;
            case 'channel':
                raison = client.textes.get("COMMAND_BLOCKED_REASON_CHANNELS", message.channel);
                errorMessage(client.textes.get("COMMAND_BLOCKED_MESSAGE", command, raison), message.member, false);
                message.delete();
                break;
            case 'dm':
                warnMessage(client.textes.get("COMMAND_ONLY_DM_MESSAGE", command), message.member);
                message.delete();
                break;
            default:
                raison = reason;
        }
        client.log(client.textes.get("COMMAND_BLOCKED_MESSAGE", command, raison), "warn");







    }
}

module.exports = CommandBlockedListener;