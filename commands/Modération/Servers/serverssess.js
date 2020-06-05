const { Command } = require('discord-akairo');
const { inspect } = require("util");
const moment = require("moment");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class ServerSessCommand extends Command {
    constructor() {
        super('server-sess', {
            aliases: ['server-sess', 'ssess'],
            category: 'Serveurs',
            description: {
                content: textes.get('GAMESERVER_SERVER_SESS_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMESERVER_SERVER_SESS_DESCRIPTION_USAGE'),
                examples: ['!server-sessions', '!ssess 1']
            },
            split: 'quoted',
        });
    }


    async *args(message) {
        const server = yield {
            type: 'server',
            prompt: {
                start: async message => {
                    await this.client.db.enmapDisplay(this.client, this.client.gameServersGetActive(), message.channel, ["servername", "gamename"]);
                    return promptMessage(textes.get('GAMESERVER_SERVER_VIEW_SERVER_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMESERVER_SERVER_VIEW_SERVER_RETRY')),
            }
        };
        return { server };
    }

    async exec(message, args) {
        let client = this.client;
        let sessionsList = [];
        let dateNow = +new Date;
        let dateFrom = moment().subtract(2, 'days');

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
            if (entry.firstSeenAt !== entry.lastSeenAt) {
                if (line == 0 || firstSeenDatePrevious !== entry.firstSeenDate) {
                    if (line == 19) {
                        sessionsList.push(`...`);
                        sessionsList.push(`${entry.firstSeenDate}`);
                        line = 1;
                    } else {
                        sessionsList.push(`${entry.firstSeenDate}`);
                        line += 1;
                    }
                }
                if (entry.isActive == true) {
                    sessionsList.push(`${entry.firstSeenTime} **${entry.displayName}** Actif depuis: ${client.msToHours(entry.lastSeenAt - entry.firstSeenAt)}`);
                    line += 1;
                } else {
                    sessionsList.push(`${entry.firstSeenTime} **${entry.displayName}** ${client.msToHours(entry.lastSeenAt - entry.firstSeenAt)} -> ${entry.lastSeenTime}`);
                    line += 1;
                }
                firstSeenDatePrevious = entry.firstSeenDate;
                if (line == 20) line = 0;
            }
        }

        await client.arrayToEmbed(sessionsList, 20, `Sessions sur ${args.server.servername}`, message.channel);

        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerSessCommand;