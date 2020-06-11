const { Command } = require('discord-akairo');
const { inspect } = require("util");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const textes = new (require(`../../../utils/textes.js`));
const ftpClient = require('ftp');

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

        // let config = {
        //     host: args.server.ip,
        //     port: args.server.portftp,
        //     user: args.server.userftp,
        //     password: args.server.pwdftp
        // }


        // let ftp = new ftpClient();
        // ftp.on('ready', function() {
        //     ftp.get('/ShooterGame/Saved/Config/WindowsServer/Game.ini', function(err, stream) {
        //       if (err) throw err;
        //       let output;
        //       stream.once('close', function() { ftp.end(); });
        //       stream.pipe(output);
        //       client.log(output);
        //     });
        //   });

        //   ftp.connect(config);
        
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerViewCommand;