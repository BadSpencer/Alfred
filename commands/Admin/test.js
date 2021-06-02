const {
    Command
} = require("discord-akairo");
const { Permissions } = require("discord.js");
const steamServerStatus = require('steam-server-status');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require('../../utils/messages');
const runner = require("child_process");

class TestCommand extends Command {
    constructor() {
        super('test', {
            aliases: ['test'],
            category: '🟪 Admin',
            cooldown: 30000,
            ratelimit: 1,
            description: 'Commande de test',
        });
    }

    async *args(message) {
        const userdata = yield {
            type: "userdata",
            prompt: {
                start: message => promptMessage(`Spécifier un membre`),
                retry: message => promptMessage(textes.get('USER_NOTEADD_MEMBER_RETRY'))
            }
        };

        return {
            userdata
        };

    }

    async exec(message, args) {
        let client = this.client;

        // var phpScriptPath = "/var/www/joomla/user.php";
        // // var argsString = "value1,value2,value3";
        // const argsString = `${args.userdata.displayName},${args.userdata.id},${args.userdata.displayName}@casual-effect.fr`;
        // runner.exec("php " + phpScriptPath + " " +argsString, function(err, phpResponse, stderr) {
        //  if(err) console.log(err); /* log error */
        // console.log( phpResponse );
        // });

        if (message.channel.type === 'text') message.delete();
    }
}


module.exports = TestCommand;