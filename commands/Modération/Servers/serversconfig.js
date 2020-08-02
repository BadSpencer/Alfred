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
const textes = new(require(`../../../utils/textes.js`));
const datamodel = require('../../../utils/datamodel');
const ftpClient = require('ftp');
const steamServerStatus = require('steam-server-status');

class ServerConfigCommand extends Command {
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
        return {
            server
        };
    }

    async exec(message, args) {
        let client = this.client;

        let config = {
            host: args.server.ip,
            port: args.server.portftp,
            user: args.server.userftp,
            password: args.server.pwdftp
        }

        let fileGamePath = '/ShooterGame/Saved/Config/WindowsServer/Game.ini';
        let fileGameUserPath = '/ShooterGame/Saved/Config/WindowsServer/GameUserSettings.ini';

        let gameContent;
        let gameuserContent;

        let ftpGame = new ftpClient();

        ftpGame.on('ready', function () {
            ftpGame.get(fileGamePath, function (err, stream) {
                if (err) return console.log(err);

                stream.on('data', function (chunk) {
                    gameContent += chunk.toString();
                });
                stream.on('end', function () {
                    let sectionFull;
                    let section;
                    let contentSplit = gameContent.split(`\n`);
                    for (const line of contentSplit) {

                        var i = line.indexOf('=');
                        var splits = [line.slice(0, i), line.slice(i + 1)];

                        if (line.startsWith("undefined[")) {
                            section = line.slice(9, line.length - 1);
                        };
                        if (line.startsWith("[")) {
                            section = line.slice(0, line.length - 1);
                        };

                        if (!line.startsWith("undefined[") && !line.startsWith("[")) {
                            let parameter = splits[0];
                            let value = splits[1].slice(0, splits[1] - 1);

                            if (parameter !== "") {
                                let gameserverConfig = datamodel.tables.gameserverConfig;
                                let id = `${args.server.id}-${section}-${parameter}`;

                                gameserverConfig.serverID = args.server.id;
                                gameserverConfig.filename = "Game.ini";
                                gameserverConfig.section = section;
                                gameserverConfig.parameter = parameter;
                                gameserverConfig.value = value;

                                client.db_gameserverconfig.set(id, gameserverConfig);
                            };
                        };
                    };
                });
            });
        });
        ftpGame.connect(config);


        let ftpGameUser = new ftpClient();

        ftpGameUser.on('ready', function () {
            ftpGameUser.get(fileGameUserPath, function (err, stream) {
                if (err) return console.log(err);

                stream.on('data', function (chunk) {
                    gameuserContent += chunk.toString();
                });
                stream.on('end', function () {
                    let sectionFull;
                    let section;
                    let contentSplit = gameuserContent.split(`\n`);
                    for (const line of contentSplit) {

                        var i = line.indexOf('=');
                        var splits = [line.slice(0, i), line.slice(i + 1)];

                        if (line.startsWith("undefined[")) {
                            section = line.slice(9, line.length - 1);
                        };
                        if (line.startsWith("[")) {
                            section = line.slice(0, line.length - 1);
                        };

                        if (!line.startsWith("undefined[") && !line.startsWith("[")) {
                            let parameter = splits[0];
                            let value = splits[1].slice(0, splits[1] - 1);

                            if (parameter !== "") {
                                let gameserverConfig = datamodel.tables.gameserverConfig;
                                let id = `${args.server.id}-${section}-${parameter}`;

                                gameserverConfig.serverID = args.server.id;
                                gameserverConfig.filename = "GameUserSettings.ini";
                                gameserverConfig.section = section;
                                gameserverConfig.parameter = parameter;
                                gameserverConfig.value = value;

                                client.db_gameserverconfig.set(id, gameserverConfig);
                            };
                        };
                    };
                });
            });
        });
        ftpGameUser.connect(config);

        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerConfigCommand;