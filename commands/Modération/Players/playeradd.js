const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('../../../utils/datamodel');
const colors = require('../../../utils/colors');
const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class PlayerAddCommand extends Command {
    constructor() {
        super('player-add', {
            aliases: ['player-add', 'padd'],
            category: 'Joueurs',
            description: {
                content: textes.get('PLAYER_ADD_DESCRIPTION_CONTENT'),
                usage: textes.get('PLAYER_ADD_DESCRIPTION_USAGE'),
                examples: ['!padd']
            }
        });
    }

    *args(message) {
        const playerID = yield {
            type: 'steamID',
            prompt: {
                start: message => promptMessage(textes.get('CMD_STEAMID_PROMPT')),
                retry: message => promptMessage(textes.get('CMD_STEAMID_RETRY'))
            }
        };

        const playerName = yield {
            type: 'string',
            match: 'rest',
            prompt: {
                start: message => promptMessage(textes.get('PLAYER_ADD_PLAYERNAME_PROMPT'))
            }
        };

        return { playerID, playerName };

    }
    async exec(message, args) {
        let client = this.client;

        let dateNow = +new Date;
        let gameserversPlayerNew = datamodel.tables.gameserversPlayers;

        let playerCheck = client.db_gameserversPlayers.get(args.playerID);
        if (playerCheck) return errorMessage(`Le joueur **${args.playerName}** (${args.playerID}) est déjà dans la base de données`, message.channel)

        gameserversPlayerNew.id = args.playerID;
        gameserversPlayerNew.steamName = args.playerName;
        gameserversPlayerNew.firstSeenAt = dateNow;
        gameserversPlayerNew.firstSeenDate = moment(dateNow).format('DD.MM.YYYY');
        gameserversPlayerNew.firstSeenTime = moment(dateNow).format('HH:mm');
        gameserversPlayerNew.lastSeenAt = dateNow;
        gameserversPlayerNew.lastSeenDate = moment(dateNow).format('DD.MM.YYYY');
        gameserversPlayerNew.lastSeenTime = moment(dateNow).format('HH:mm');

        client.db_gameserversPlayers.set(gameserversPlayerNew.id, gameserversPlayerNew);
        successMessage(`Le joueur **${args.playerName}** (${args.playerID}) à été correctmeent ajouté à la base de données`, message.channel);

        if (message.channel.type === 'text') message.delete();;
    }

}
module.exports = PlayerAddCommand;