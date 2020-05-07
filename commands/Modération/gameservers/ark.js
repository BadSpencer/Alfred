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

class ArkCommand extends Command {
    constructor() {
        super('ark', {
            aliases: ['ark'],
            category: 'Modération',
            description: {
                content: 'Actions sur les serveurs ARK',
                usage: '\`!ark <action> <serverID>\`',
            },
            split: 'quoted',
            args: [
                {
                    id: "action",
                    type: [
                        'dwd',
                        'cmd',
                        'maint', 'nomaint',
                        'chat', 'tchat', 'send'
                    ],
                    prompt: {
                        start: 'Quelle action souhaitez-vous exécuter ?\ndwd cmd maint nomaint',
                        retry: 'Ce n\'est pas une action valide'
                    },
                },
                {
                    id: "serverID",
                    prompt: {
                        start: 'Sur quel serveur ? Il me faut soit son ID soit "all" pour tous les serveurs'
                    },
                },
                {
                    id: "arguments",
                    type: "content",
                    match: "rest",
                    default: null,
                }
            ],
            description: {
                content: 'Gestion des serveurs de jeu',
                usage: '',
                examples: ['']
            }
        });
    }
    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);
        let servers = [];

        if (args.serverID == "all") {
            servers = await client.db_gameservers.filterArray(server => server.gamename == "ARK: Survival Evolved" && server.isActive == true);
        } else {
            servers.push(client.db_gameservers.get(args.serverID));
        }

        let game = client.db_games.get("ARK: Survival Evolved");
        const gameTextChannel = await guild.channels.get(game.textChannelID);

        switch (args.action) {
            case 'dwd':
                for (const server of servers) {
                    await client.gameServersArkDWD(server.id, message);
                }
                break;
            case 'maint':
                if (args.serverID == "all") {
                    warnMessage(`Les serveurs "ARK: Survival Evolved" entrent en maintenance.`, gameTextChannel, false);
                }
                for (const server of servers) {
                    if (args.serverID !== "all") {
                        warnMessage(`Le serveur ${server.servername} entre en maintenance.`, gameTextChannel, false);
                    }
                    if (server.connected > 0) warnMessage(`Attention, il y a **${server.connected} joueur(s)** connecté(s) sur ${server.servername}`, message.channel);
                    if (server.connected == 0) successMessage(`Aucun joueur connecté sur ${server.servername} vous pouvez y aller`, message.channel);
                    await client.gameServersSetMaintenanceOn(server.id);
                    await client.gameRconQuery(server, "ServerChat Le serveur va entrer en maintenance. Merci de vous mettre a l'abri et de vous deconnecter");
                }
                break;
            case 'nomaint':
                for (const server of servers) {
                    await client.gameServersSetMaintenanceOff(server.id);
                }
                break;
                case 'send':
                case 'tchat':
                case 'chat':
                    let sendmess = 'ServerChat ' + args.arguments.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    for (const server of servers) {
                        await client.gameRconQuery(server, sendmess)
                    }
                    break;                
            case 'cmd':
                for (const server of servers) {
                    await client.gameRconQuery(server, args.arguments)
                }
                break;
        }

        if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;
    }

}
module.exports = ArkCommand;