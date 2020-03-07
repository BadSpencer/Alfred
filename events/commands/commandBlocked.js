const {
    Listener
} = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment');
const { errorMessage } = require('../../utils/messages');

class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            eventName: 'commandBlocked'
        });
    }

    exec(message, command, reason) {
        let client = this.client;

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
            default: raison = reason;
        }

        if (message.channel === 'text') {
            if (message.author.id === message.guild.ownerID) {
                user = `${chalk.red('[GUILD OWNER]')} ${message.author.tag} (${message.author.id})`
            }
        }

        if (message.author.id === process.env.OWNER_ID) {
            user = `${chalk.green('[OWNER]')} ${message.author.tag}`
        } else {
            user = `${chalk.gray('[USER]')} ${message.author.tag} (${message.author.id})`
        }

        if (message.channel.type === 'dm') {
            guild = `${chalk.red('DM')}: ${chalk.yellow(message.author.id)}`;
            blocked = `Commande ${chalk.magenta(command)} bloquée pour ${user} raison: ${raison}`;
        } else {
            guild = `${chalk.red('GUILD')}: ${chalk.yellow(message.guild.id)}`;
            blocked = `Commande ${chalk.magenta(command)} bloquée pour ${user} raison: ${raison} dans #${message.channel.name}`;
        }

        // Log 
        errorMessage(client.textes.get("COMMAND_BLOCKED_MESSAGE", command, raison), message.channel);
        this.client.logger.warn(`${blocked}`);






    }
}

module.exports = CommandBlockedListener;