const { Listener } = require('discord-akairo');
const chalk = require('chalk');


class CommandStartedListener extends Listener {
    constructor() {
        super('commandStarted', {
            emitter: 'commandHandler',
            eventName: 'commandStarted',
        })
    }

    exec(message, command) {
        let commandUsed = command;
        let timestamp = `${new Date()}`;
        timestamp.setDate(timestamp.getDate());

        // Create the log itself with Chalk and Moment
        let guild;
        let used;
        let user;

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
            used = `Commande ${chalk.magenta(commandUsed)} lancée par ${user}`;
        } else {
            guild = `${chalk.red('GUILD')}: ${chalk.yellow(message.guild.id)}`;
            used = `Commande ${chalk.magenta(commandUsed)} lancée par ${user} dans #${message.channel.name}`;
        }

        // Log it
        console.log(`${timestamp} | ${guild} | ${used}`);
    }
};

module.exports = CommandStartedListener;