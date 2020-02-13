const { Listener } = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment');


class CommandStartedListener extends Listener {
    constructor() {
        super('commandStarted', {
            emitter: 'commandHandler',
            eventName: 'commandStarted',
        })
    }

    exec(message, command) {
        let commandUsed = command;
        let timestamp = `${moment(new Date()).format("DD-MM-YY HH:mm:ss")}`;

        // Préparation du log
        let guild;
        let used;
        let user;

        if (message.channel === 'text') {
            if (message.author.id === message.guild.ownerID) {
                user = `${chalk.red('[Admin serveur]')} ${message.author.tag} (${message.author.id})`
            }
        }

        if (message.author.id === this.client.config.owner) {
            user = `${chalk.green('[Admin Alfred]')} ${message.author.tag}`
        } else {
            user = `${chalk.gray('[Utilsateur]')} ${message.author.tag} (${message.author.id})`
        }

        if (message.channel.type === 'dm') {
            guild = `${chalk.red('MP')}: ${chalk.yellow(message.author.id)}`;
            used = `Commande ${chalk.magenta(commandUsed)} lancée par ${user}`;
        } else {
            guild = `${chalk.red('SERVEUR')}: ${chalk.yellow(message.guild.id)}`;
            used = `Commande ${chalk.magenta(commandUsed)} lancée par ${user} dans #${message.channel.name}`;
        }

        // Log
        this.client.logger.log(`${used}`);

        const filter = (reaction, client) => reaction.emoji.name === '✅' && client.id === this.client.id;
        message.react('✅');
        message.awaitReactions(filter, {
            time: 5000
        })
            .catch(() => {
                errorMessage('Le délai a été dépassé, veuillez réessayer plus tard.', message)
            });
    }
};

module.exports = CommandStartedListener;