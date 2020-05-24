const {
    Command
} = require('discord-akairo');
const { Permissions } = require('discord.js');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../../../utils/messages');
const moment = require("moment");
const datamodel = require('../../../utils/datamodel');

class userboardCommand extends Command {
    constructor() {
        super('userboard', {
            aliases: ['userboard', 'ub'],
            category: 'Modération',
            description: {
                content: 'Panneau d\'informations sur les utilisateurs',
                usage: '',
                examples: ['']
            }
        });
    }

    async exec(message) {
        let client = this.client;
        await client.userdataUserboard(message);
        if (message.channel.type === 'text') message.delete();
    }
}

module.exports = userboardCommand;