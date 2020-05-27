const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('../../../utils/datamodel');
const colors = require('../../../utils/colors');
const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');

class PlayersCommand extends Command {
    constructor() {
        super('players', {
            aliases: ['players', 'player', 'p'],
            category: 'Modération',
            description: {
                content: 'Gestion des joueurs (serveurs privés)',
                usage: '',
                examples: ['']
            }
        });
    }

    *args(message) { }

    async exec(message, args) {
        let client = this.client;
        client.gameServersListPlayers(message);
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = PlayersCommand;