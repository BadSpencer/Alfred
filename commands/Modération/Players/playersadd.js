const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('../../../utils/datamodel');
const colors = require('../../../utils/colors');
const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');

class PlayersAddCommand extends Command {
    constructor() {
        super('players-add', {
            aliases: ['players-add', 'padd'],
            category: 'Modération',
            description: {
                content: `Ajouter manuellement un joueur via son SteamID et son compte Steam.
                Les joueurs sont automatiquement enregistrés. Cette commande ne sert qu'en cas de problème avec la base et qu'on doit ajouter un ancien joueur qui ne se connectera plus. `,
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

        const playerName = yield {
            type: 'string',
            match: 'rest',
            prompt: {
                start: message => promptMessage(`Quel est le compte Steam du joueur ?`),
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

        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;
    }

}
module.exports = PlayersAddCommand;