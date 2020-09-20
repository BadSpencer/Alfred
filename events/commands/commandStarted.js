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

        let used;
        if (message.channel.type === 'dm') {
            used = `Commande ${chalk.magenta(command)} lancée par ${message.author.username} (Mess privé)`;
        } else {
            used = `Commande ${chalk.magenta(command)} lancée par ${message.author.username} dans #${message.channel.name}`;
        }

        client.log(`${used}`);


    }
};

module.exports = CommandStartedListener;