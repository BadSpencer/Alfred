const fs = require('fs');
const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('../../../utils/datamodel');
const colors = require('../../../utils/colors');
const {
    Command
} = require('discord-akairo');
const {
    inspect
} = require("util");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require('../../../utils/messages');

class ServersCommand extends Command {
    constructor() {
        super('players', {
            aliases: ['players', 'player', 'p'],
            category: 'Modération',
            description: {
                content: 'Gestion serveurs de jeu',
                usage: '\`!servers aide\` pour avoir de l\'aide',
            },
            split: 'quoted',
            args: [
                {
                    id: "action",
                    type: [
                        'liste', 'list',
                        'link',
                        'ban',
                        'unban',
                        'add'
                    ],
                    default: 'liste',
                },
                {
                    id: "arguments",
                    type: "content",
                    match: "rest",
                    default: null,
                }
            ],
            description: {
                content: 'Gestion des joueurs (serveurs privés)',
                usage: '',
                examples: ['']
              }
        });
    }
    async exec(message, args) {
        let client = this.client;


        let splittedArgs;
        
        if (args.arguments !== null) {
            splittedArgs = args.arguments.split(" ");
        }


        switch (args.action) {
            case 'liste':
            case 'list':
                client.gameServersListPlayers(message);
                //client.db.enmapDisplay(client, client.db_gameserversPlayers, message.channel, ["steamName", "memberID", "lastSeenDate", "lastSeenTime"]);
                break;
            case 'link':
                let playerID = splittedArgs[0];
                let memberID = splittedArgs[1];
                await client.gameServersPlayerLink(message, playerID, memberID);
                break;

            case 'ban':
                await client.gameServersPlayerBan(args.arguments, message);
                break;
            case 'unban':
                await client.gameServersPlayerUnban(args.arguments, message)
                break;

            case 'add':
                let dateNow = +new Date;
                let gameserversPlayerNew = datamodel.tables.gameserversPlayers;
                gameserversPlayerNew.id = splittedArgs[0];
                gameserversPlayerNew.steamName = splittedArgs[1];
                gameserversPlayerNew.firstSeenAt = dateNow;
                gameserversPlayerNew.firstSeenDate = moment(dateNow).format('DD.MM.YYYY');
                gameserversPlayerNew.firstSeenTime = moment(dateNow).format('HH:mm');
                gameserversPlayerNew.lastSeenAt = dateNow;
                gameserversPlayerNew.lastSeenDate = moment(dateNow).format('DD.MM.YYYY');
                gameserversPlayerNew.lastSeenTime = moment(dateNow).format('HH:mm');
                await client.db_gameserversPlayers.set(gameserversPlayerNew.id, gameserversPlayerNew);
                // await client.modLog(client.textes.get("GAMESERVER_NEW_PLAYER_DETECTED", server, gameserversPlayerNew.id, gameserversPlayerNew.steamName));

                break;
        }

        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;
    }

}
module.exports = ServersCommand;