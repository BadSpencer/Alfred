const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('../../../utils/datamodel');
const colors = require('../../../utils/colors');
const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class PlayerLinkCommand extends Command {
    constructor() {
        super('player-link', {
            aliases: ['player-link', 'plink'],
            category: 'Joueurs',
            description: {
                content: textes.get('PLAYER_LINK_DESCRIPTION_CONTENT'),
                usage: textes.get('PLAYER_LINK_DESCRIPTION_USAGE'),
                examples: ['!plink']
            }
        });
    }

    *args(message) {
        let client = this.client;
        const player = yield {
            type: 'player',
            prompt: {
                start: async message => { 
                    await this.client.db.enmapDisplay(client, client.db_gameserversPlayers.filter(rec => rec.memberID == ""), message.channel, ['steamName', 'memberID']);
                    return promptMessage(textes.get('CMD_PLAYER_PROMPT'))
                },
                retry: message => promptMessage(textes.get('CMD_PLAYER_RETRY'))
            }
        };

        let gameserversPlayer = client.db_gameserversPlayers.get(player.id);
        if (!gameserversPlayer.memberID == "") {
            let linkedUserdata = client.db_userdata.get(gameserversPlayer.memberID);
            warnMessage(textes.get("GAMESERVER_ERROR_PLAYERID_ALREADY_LINKED", player.id, linkedUserdata), message.channel);
        };

        const userdata = yield {
            type: 'userdata',
            prompt: {
                start: message => promptMessage(textes.get('CMD_USERDATA_PROMPT')),
                retry: message => promptMessage(textes.get('CMD_USERDATA_RETRY'))
            }
        };

        return { player, userdata };

    }
    async exec(message, args) {
        let client = this.client;

        await client.gameServersPlayerLink(message, args.player.id, args.userdata);

        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = PlayerLinkCommand;