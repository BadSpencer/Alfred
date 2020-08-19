const { Listener } = require("discord-akairo");
const chalk = require('chalk');
const moment = require('moment');


class CommandStartedListener extends Listener {
    constructor() {
        super('commandStarted', {
            emitter: 'commandHandler',
            event: 'commandStarted',
        })
    }

    async exec(message, command) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, 'debug');
        let commandUsed = command;
        let timestamp = `${moment(new Date()).format("DD-MM-YY HH:mm:ss")}`;

        // Préparation du log
        let used;
        if (message.channel.type === 'dm') {
            used = `Commande ${chalk.magenta(commandUsed)} lancée par ${message.author.username} (Mess privé)`;
        } else {
            used = `Commande ${chalk.magenta(commandUsed)} lancée par ${message.author.username} dans #${message.channel.name}`;
        }

        // Log
        client.log(`${used}`);
        await client.commandLog(message, command);

    }
};

module.exports = CommandStartedListener;