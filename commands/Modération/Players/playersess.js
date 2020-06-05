const Discord = require("discord.js");
const moment = require("moment");
const datamodel = require('../../../utils/datamodel');
const colors = require('../../../utils/colors');
const { Command } = require('discord-akairo');
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class PlayerSessCommand extends Command {
    constructor() {
        super('player-sess', {
            aliases: ['player-sess', 'psess'],
            category: 'Joueurs',
            description: {
                content: textes.get('PLAYER_SESS_DESCRIPTION_CONTENT'),
                usage: textes.get('PLAYER_SESS_DESCRIPTION_USAGE'),
                examples: ['!psess', '!psess 76561197969159665']
            }
        });
    }

    async *args(message) {
        const player = yield {
            type: 'player',
            prompt: {
                start: async message => {
                    await this.client.db.enmapDisplay(this.client, this.client.db_gameserversPlayers, message.channel, ['steamName', 'memberID']);
                    return promptMessage(textes.get('CMD_PLAYER_PROMPT'))
                },
                retry: message => promptMessage(textes.get('CMD_PLAYER_RETRY'))
            }
        };
        return { player };
    }

    async exec(message, args) {
        let client = this.client;
        let sessionsList = [];
        let dateNow = +new Date;
        let dateFrom = moment().subtract(2, 'days');

        let entries = client.db_playersLogs.filterArray(record =>
            record.playerID == args.player.id &&
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
                let server = client.db_gameservers.get(entry.serverID)
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
                    sessionsList.push(`${entry.firstSeenTime} **${server.servername}** Actif depuis: ${client.msToHours(entry.lastSeenAt - entry.firstSeenAt)}`);
                    line += 1;
                } else {
                    sessionsList.push(`${entry.firstSeenTime} **${server.servername}** ${client.msToHours(entry.lastSeenAt - entry.firstSeenAt)} -> ${entry.lastSeenTime}`);
                    line += 1;
                }
                firstSeenDatePrevious = entry.firstSeenDate;
                if (line == 20) line = 0;
            }
        }

        await client.arrayToEmbed(sessionsList, 20, `Sessions de ${args.player.steamName} (${args.player.id})`, message.channel);

        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = PlayerSessCommand;