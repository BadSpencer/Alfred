const { Command } = require('discord-akairo');
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));
const datamodel = require('../../../utils/datamodel');
const ftpClient = require('ftp');
const steamServerStatus = require('steam-server-status');

class ServerViewCommand extends Command {
    constructor() {
        super('server-config', {
            aliases: ['server-config', 'sconfig'],
            category: 'Serveurs',
            description: {
                content: textes.get('GAMESERVER_SERVER_VIEW_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMESERVER_SERVER_VIEW_DESCRIPTION_USAGE'),
                examples: ['!server-view', '!sview 1']
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

        let config = {
            host: args.server.ip,
            port: args.server.portftp,
            user: args.server.userftp,
            password: args.server.pwdftp
        }

        steamServerStatus.getServerStatus(
            args.server.ip, args.server.portrcon, function(serverInfo) {
                if (serverInfo.error) {
                    console.log(serverInfo.error);
                } else {
                    console.log(`Jeu: ${serverInfo.gameName}`);
                    console.log(`Nom: ${serverInfo.serverName}`);
                    console.log(`Nb joueurs: ${serverInfo.numberOfPlayers}/${serverInfo.maxNumberOfPlayers}`)
                }
        });

        let content = '';
        let ftp = new ftpClient();
        ftp.on('ready', function () {
            ftp.get('/ShooterGame/Saved/Config/WindowsServer/Game.ini', function (err, stream) {
                if (err) throw err;

                stream.on('data', function (chunk) {
                    content += chunk.toString();
                });
                stream.on('end', function () {
                    //client.log(content);
                    let contentSplit = content.split(`\n`);

                    for (const line of contentSplit) {

                        if (line == "[/script/shootergame.shootergamemode]") continue;

                        let gameserverconfig = datamodel.tables.gameserverconfig;

                        var i = line.indexOf('=');
                        var splits = [line.slice(0, i), line.slice(i + 1)];

                        let parameter = splits[0];
                        let value = splits[1];


                        // let record = client.db_gameserverconfig.find(rec =>
                        //     rec.serverID == args.server.id &&
                        //     rec.filename == "Game.ini" &&
                        //     rec.parameter == parameter
                        // );



                    }
                });
            });
        });
        ftp.connect(config);





        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerViewCommand;