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
        let commandUsed = command;
        let timestamp = `${moment(new Date()).format("DD-MM-YY HH:mm:ss")}`;

        // Préparation du log
        let guild;
        let blocked;
        let user;
        let raison;

        switch (reason) {
            case 'blacklist': {
                raison = `Utilisateur blacklisté`;
                break;
            }
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
            blocked = `Commande ${chalk.magenta(commandUsed)} bloquée pour ${user} raison: ${raison}`;
        } else {
            guild = `${chalk.red('GUILD')}: ${chalk.yellow(message.guild.id)}`;
            blocked = `Commande ${chalk.magenta(commandUsed)} bloquée pour ${user} raison: ${raison} dans #${message.channel.name}`;
        }

        // Log 
        errorMessage(`Commande bloquée pour la raison: ***\`${raison}\`***`, message);
        this.client.logger.warn(`${blocked}`);






    }
}

module.exports = CommandBlockedListener;