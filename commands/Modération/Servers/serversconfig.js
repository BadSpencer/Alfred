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
       // let fileGameUserPath = '/ShooterGame/Saved/Config/WindowsServer/GameUserSettings.ini';

      client.getFileByFTP(args.server.ip, args.server.portftp, args.server.userftp, args.server.pwdftp, fileGamePath).then( content => {
        for (const line of content) {
            var i = line. indexOf('=');
            var splits = [line.slice(0, i), line.slice(i + 1)];

            let parameter = splits[0];
            let value = splits[1].slice(0, splits[1] - 1);

            let gameserverConfig = datamodel.tables.gameserverConfig;
 
            gameserverConfig.id = `${args.server.id}-${parameter}`;
            gameserverConfig.serverID = args.server.id;
            gameserverConfig.filename = "Game.ini";
            gameserverConfig.section = "";
            gameserverConfig.parameter = parameter;
            gameserverConfig.value = value;

            client.db_gameserverconfig.set(gameserverConfig.id, gameserverConfig);

        };
      })



    //    let fileGameUserContent = await client.getFileByFTP(args.server.ip, args.server.portftp, args.server.userftp, args.server.pwdftp, fileGameUserPath);

     //   for (const line of fileGameUserContent) {
    //    };



        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerConfigCommand;