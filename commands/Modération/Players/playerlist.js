const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('../../../utils/datamodel');
const colors = require('../../../utils/colors');
const { Command } = require("discord-akairo");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class PlayerListCommand extends Command {
    constructor() {
        super('player-list', {
            aliases: ['player-list', 'plist'],
            category: 'Joueurs',
            description: {
                content: textes.get('PLAYER_LIST_DESCRIPTION_CONTENT'),
                usage: textes.get('PLAYER_LIST_DESCRIPTION_USAGE'),
                examples: ['!plist']
            }
        });
    }

    *args(message) {
    }

    async exec(message, args) {
        let client = this.client;
        await client.gameServersListPlayers(message);
        if (message.channel.type === 'text') message.delete();;
    }

}
module.exports = PlayerListCommand;