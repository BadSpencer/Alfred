const {
    Command
} = require('discord-akairo');
const { Permissions } = require('discord.js');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require('../../utils/messages');
const colors = require('../../utils/colors');


class BanCommand extends Command {
    constructor() {
        super('ban', {
            aliases: ['ban'],
            category: 'Modération',
            args: [
                {
                    id: 'userdata',
                    type: 'userdata',
                    prompt: {
                        start: message => promptMessage('Quel membre souhaitez vous bannir ?'),
                        retry: message => promptMessage('Mentionnez un membre avec son ID'),
                    },
                },
                {
                    id: 'raison',
                    type: "content",
                    match: "rest",
                    prompt: {
                        start: message => promptMessage('Pour quelle raison souhaitez vous bannir ce membre ?'),
                    },
                }
            ],
            description: {
                content: 'Bannir un membre (ne peut plus revenir)',
                usage: '',
                examples: ['']
              }
        });
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);
        let member = guild.members.get(args.userdata.id);

        if (!member) return errorMessage(client.textes.get("USER_ERROR_NOT_A_MEMBER", args.userdata.displayName), message.channel);
        if (member.hasPermission(Permissions.FLAGS.MANAGE_GUILD)) return errorMessage(client.textes.get("USER_ERROR_NOT_BANABLE", args.userdata.displayName), message.channel);
        if (member.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES)) return errorMessage(client.textes.get("USER_ERROR_NOT_BANABLE", args.userdata.displayName), message.channel);

        let questionMess = await questionMessage(client.textes.get("USER_BAN_CHECK_BEFORE", member), message.channel);
        const responses = await message.channel.awaitMessages(msg => msg.author.id === message.author.id, {
            max: 1,
            time: 30000,
        });

        if (responses.size !== 1) {
            warnMessage(client.textes.get("COM_ACTION_TIMEOUT"), message.channel);
            return null;
        }
        const response = responses.first();
    
        if (response.content == "oui") {
            if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;
            if (message.channel.type === 'text') response.delete();

            
            client.userdataAddLog(args.userdata, message.member, "BAN", args.raison);
            await member.send(client.textes.get("USER_BAN_NOTIFICATION_TO_USER", message.member, args.raison))
            await member.ban(args.raison);
            client.serverBanNotification(amember, message.member, args.raison);
            successMessage(client.textes.get("USER_BAN_CHECK_SUCCESS", member), message.channel);
        } else {
            if (message.channel.type === 'text') if (message.channel.type === 'text') message.delete();;
            if (message.channel.type === 'text') response.delete();

            warnMessage(client.textes.get("COM_ACTION_ANNULLE"), message.channel);
            return null;
        }
        
    }
}


module.exports = BanCommand;