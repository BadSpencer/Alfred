const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('../../../utils/datamodel');
const colors = require('../../../utils/colors');
const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');

class PlayersBanCommand extends Command {
    constructor() {
        super('players-ban', {
            aliases: ['players-ban', 'pban'],
            category: 'Modération',
            description: {
                content: 'Bannir un joueur des serveurs privés',
                usage: '',
                examples: ['']
            }
        });
    }

    *args(message) {
        const playerID = yield {
            type: 'steamID',
            prompt: {
                start: message => promptMessage(`Quel est le SteamID du joueur ?`),
                retry: message => promptMessage(`Ce n'est pas un SteamID valide. Il doit commencer par "7656" et comporte 17 caractères en tout`)
            }
        };
        return { playerID };
    }
    
    async exec(message, args) {
        let client = this.client;

        await client.gameServersPlayerBan(args.playerID, message);

       if (message.channel.type === 'text') message.delete();
    }

}
module.exports = PlayersBanCommand;