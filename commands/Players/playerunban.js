const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('../../utils/datamodel');
const colors = require('../../utils/colors');
const { Command } = require("discord-akairo");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../utils/messages');
const textes = new (require(`../../utils/textes.js`));

class PlayerUnbanCommand extends Command {
    constructor() {
        super('player-unban', {
            aliases: ['player-unban', 'punban'],
            category: '🟪 Joueurs',
            description: {
                content: textes.get('PLAYER_UNBAN_DESCRIPTION_CONTENT'),
                usage: textes.get('PLAYER_UNBAN_DESCRIPTION_USAGE'),
                examples: ['!punban', '!punban 76561197969159665']
            }
        });
    }

    async *args(message) {
        const player = yield {
            type: 'player',
            prompt: {
                start: async message => { 
                    await this.client.db.enmapDisplay(this.client, this.client.db_gameserversPlayers.filter(rec => rec.isBanned == true), message.channel, ['steamName', 'memberID']);
                    return promptMessage(textes.get('CMD_PLAYER_PROMPT'))
                },
                retry: message => promptMessage(textes.get('CMD_PLAYER_RETRY'))
            }
        };
        return { player };
    }
    async exec(message, args) {
        let client = this.client;
        await client.gameServersPlayerUnban(args.player.id, message)
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = PlayerUnbanCommand;