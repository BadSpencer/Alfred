const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('../../../utils/datamodel');
const colors = require('../../../utils/colors');
const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');

class PlayersLinkCommand extends Command {
    constructor() {
        super('players-link', {
            aliases: ['players-link', 'plink'],
            category: 'Modération',
            description: {
                content: 'Gestion des joueurs (serveurs privés)',
                usage: '',
                examples: ['']
            }
        });
    }

    *args(message) {
        let client = this.client;
        const playerID = yield {
            type: 'steamID',
            prompt: {
                start: message => promptMessage(`Quel est le SteamID du joueur ?`),
                retry: message => promptMessage(`Ce n'est pas un SteamID valide. Il doit commencer par "7656" et comporte 17 caractères en tout`)
            }
        };

        let gameserversPlayer = client.db_gameserversPlayers.get(playerID);
        if (!gameserversPlayer.memberID == "") {
            let linkedUserdata = client.db_userdata.get(gameserversPlayer.memberID);
            warnMessage(client.textes.get("GAMESERVER_ERROR_PLAYERID_ALREADY_LINKED", playerID, linkedUserdata), message.channel);
        };

        const userdata = yield {
            type: 'userdata',
            prompt: {
                start: message => promptMessage(`Quel est l'ID du membre discord ?`),
                retry: message => promptMessage(`Je ne trouve aucun membre avec cet ID, êtes vous sûr de votre saisie ?`)
            }
        };

        return { playerID, userdata };

    }
    async exec(message, args) {
        let client = this.client;

        await client.gameServersPlayerLink(message, args.playerID, args.userdata);

        if (message.channel.type === 'text') message.delete();;
    }

}
module.exports = PlayersLinkCommand;