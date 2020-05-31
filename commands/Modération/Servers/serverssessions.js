const { Command } = require('discord-akairo');
const { inspect } = require("util");
const moment = require("moment");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');

class ServerSessionsCommand extends Command {
    constructor() {
        super('server-sessions', {
            aliases: ['server-sessions', 'server-sess', 'ssessions', 'ssess'],
            category: 'Modération',
            description: {
                content: `Afficher les sessions de jeu d'un serveur`,
                usage: '',
                examples: ['']
            },
            split: 'quoted',
        });
    }


    async *args(message) {

        const server = yield {
            type: 'server',
            prompt: {
                start: async message => { 
                    await this.client.db.enmapDisplay(this.client, this.client.db_gameservers.filter(record => record.id !== "default" && record.isActive == true), message.channel, ["servername", "gamename", "ip", "port"]);
                    return promptMessage(this.client.textes.get('GAMESERVER_SERVER_VIEW_SERVER_PROMPT'))
                },
                retry: message => promptMessage(this.client.textes.get('GAMESERVER_SERVER_VIEW_SERVER_RETRY')),
            }
        };


        // msgServerList.delete();
        return { server };
    }

    async exec(message, args) {
        let client = this.client;

        let sessionsList = [];

        let dateNow = +new Date;

        let dateFrom = dateNow - 86400000; // 1 jours
        // let dateFrom = dateNow - (86400000 * 2‬); // 2 jours
        // let dateFrom = dateNow - 7200000; // 2 heures

        let entries = client.db_playersLogs.filterArray(record =>
            record.serverID == args.server.id &&
            record.firstSeenAt <= dateNow &&
            record.lastSeenAt >= dateFrom
        );
        entries.sort(function (a, b) {
            return a.firstSeenAt - b.firstSeenAt;
        });

        let firstSeenDatePrevious = null;
        let line = 0;
        for (const entry of entries) {
            if (line == 0 || firstSeenDatePrevious !== entry.firstSeenDate) {
                if (line == 19) {
                    sessionsList.push(`...`);
                    line += 1;
                } else {
                    sessionsList.push(`${entry.firstSeenDate}`);
                    line += 1;
                }
            }
            if (entry.isActive == true) {
                sessionsList.push(`${entry.firstSeenTime} **${entry.displayName}** Actif depuis: ${client.msToHours(entry.lastSeenAt - entry.firstSeenAt)}`);
                line += 1;
            } else {
                sessionsList.push(`${entry.firstSeenTime} **${entry.displayName}** ${client.msToHours(entry.lastSeenAt - entry.firstSeenAt)}`);
                line += 1;
            }
            firstSeenDatePrevious = entry.firstSeenDate;
            if (line == 20) line = 0;
        }

        await client.arrayToEmbed(sessionsList, 20, `Sessions sur ${args.server.servername}`, message.channel);

        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerSessionsCommand;