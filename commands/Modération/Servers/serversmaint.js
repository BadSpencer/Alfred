const { Command } = require('discord-akairo');
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));

class ServerMaintCommand extends Command {
    constructor() {
        super('server-maint', {
            aliases: ['server-maint', 'smaint'],
            category: 'Serveurs',
            description: {
                content: textes.get('GAMESERVER_SERVER_MAINT_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMESERVER_SERVER_MAINT_DESCRIPTION_USAGE'),
                examples: ['!server-maint', '!smaint on 1', '!smaint off *']
            },
            split: 'quoted',
        });
    }


    async *args(message) {
        const mode = yield {
            type: 'onoff',
            prompt: {
                start: message => {
                    return promptMessage(textes.get('GAMESERVER_SERVER_MAINT_MODE_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMESERVER_SERVER_MAINT_MODE_RETRY')),
            }
        };

        const serverID = yield {
            type: 'serverID',
            prompt: {
                start: async message => {
                    await this.client.db.enmapDisplay(this.client, this.client.gameServersGetActive(), message.channel, ["servername", "gamename"]);
                    return promptMessage(textes.get('GAMESERVER_SERVER_MAINT_SERVER_PROMPT'))
                },
                retry: message => promptMessage(textes.get('GAMESERVER_SERVER_MAINT_SERVER_RETRY')),
            }
        };
        return { mode, serverID };
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.cache.get(client.config.guildID);

        // Constitution de la liste des serveurs
        let servers = [];
        if (args.serverID == "*") {
            servers = client.gameServersGetActive(true);
        } else {
            servers.push(client.gameServersGet(args.serverID));
        }


        // Constitution de la liste des jeux concernés pour annoncer la maintenance
        let games = [];
        for (const server of servers) {
            let game = games.find(rec => rec.gamename == server.gamename);
            if (!game) {
                game = { 'gamename': server.gamename };
                games.push(game);
            };
        };

        if (args.serverID == "*") {
            for (const game of games) {
                let dbgame = client.db_games.get(game.gamename);
                if (dbgame) {
                    const gameTextChannel = guild.channels.cache.get(dbgame.textChannelID);
                    if (args.mode == 'on') {
                        warnMessage(textes.get('GAMESERVER_SERVER_MAINT_WARN_GAME_MAINT_ON', game.gamename), gameTextChannel, true, 600000);
                    } else {
                        successMessage(textes.get('GAMESERVER_SERVER_MAINT_SUCCESS_MAINT_OVER'), gameTextChannel, true, 600000);
                    }
                }
            };
            for (const server of servers) {
                if (args.mode == 'on') {
                    if (server.connected > 0) warnMessage(textes.get('GAMESERVER_SERVER_MAINT_WARN_PLAYERS_CONNECTED', server), message.channel);
                    if (server.connected == 0) successMessage(textes.get('GAMESERVER_SERVER_MAINT_SUCCESS_NO_PLAYERS', server), message.channel);
                    await client.gameServersSetMaintenanceOn(server.id);
                    await client.gameRconQuery(server, `ServerChat ${textes.get('GAMESERVER_SERVER_MAINT_MSG_TO_PLAYERS')}`);
                } else {
                    await client.gameServersSetMaintenanceOff(server.id);
                }
            };
        } else {
            let server = client.gameServersGet(args.serverID);
            let dbgame = client.db_games.get(server.gamename);
            if (dbgame) {

                const gameTextChannel = guild.channels.cache.get(dbgame.textChannelID);
                if (args.mode == 'on') {
                    warnMessage(textes.get('GAMESERVER_SERVER_MAINT_WARN_SERVER_MAINT_ON', server), gameTextChannel, true, 600000);
                    if (server.connected > 0) warnMessage(textes.get('GAMESERVER_SERVER_MAINT_WARN_PLAYERS_CONNECTED', server), message.channel);
                    if (server.connected == 0) successMessage(textes.get('GAMESERVER_SERVER_MAINT_SUCCESS_NO_PLAYERS', server), message.channel);
                    await client.gameServersSetMaintenanceOn(server.id);
                    await client.gameRconQuery(server, `ServerChat ${textes.get('GAMESERVER_SERVER_MAINT_MSG_TO_PLAYERS')}`);
                } else {
                    await client.gameServersSetMaintenanceOff(server.id);
                    successMessage(textes.get('GAMESERVER_SERVER_MAINT_SUCCESS_MAINT_OVER'), gameTextChannel, true, 600000);
                }
            }
        };

        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerMaintCommand;