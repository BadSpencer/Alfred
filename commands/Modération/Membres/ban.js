const {
    Command
} = require("discord-akairo");
const {
    Permissions
} = require("discord.js");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require('../../../utils/messages');
const colors = require('../../../utils/colors');


class BanCommand extends Command {
    constructor() {
        super('ban', {
            aliases: ['ban'],
            category: '🟪 Membres',
            description: {
                content: 'Bannir un membre (ne peut plus revenir)',
                usage: '',
                examples: ['']
            }
        });
    }

    * args(message) {
        const userdata = yield {
            type: 'userdata',
            prompt: {
                start: message => promptMessage('Quel membre souhaitez vous bannir ?'),
                retry: message => promptMessage(this.client.textes.get('USER_MEMBER_RETRY'))
            }
        };

        const confirmation = yield {
            type: 'ouinon',
            prompt: {
                start: message => promptMessage(`Êtes-vous sûr de vouloir bannir **${this.client.memberGetDisplayNameByID(userdata.id)}** ?`),
                retry: message => promptMessage(this.client.textes.get('CMD_OUINON_RETRY'))
            }
        }

        const reason = yield (confirmation == 'oui' ? {
            type: 'string',
            prompt: {
                start: message => promptMessage(`Veuillez saisir une **raison** pour ce bannissement\n\nCe texte sera envoyé au membre par message privé avant son bannissement`)
            }
        } : {
            type: 'string',
            default: 'commande annulée'
        });

        return {
            userdata,
            confirmation,
            reason,
        };
    }

    async exec(message, args) {

        let guildMember = this.client.memberGet(args.userdata.id);

        if (!guildMember) return errorMessage(this.client.textes.get("USER_ERROR_NOT_A_MEMBER", this.client.memberGetDisplayNameByID(args.userdata.id)), message.channel);

        if (args.confirmation == 'oui') {
            if (guildMember.hasPermission(Permissions.FLAGS.MANAGE_GUILD)) return errorMessage(this.client.textes.get("USER_ERROR_NOT_BANABLE", this.client.memberGetDisplayNameByID(guildMember.id)), message.channel);
            if (guildMember.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES)) return errorMessage(this.client.textes.get("USER_ERROR_NOT_BANABLE", this.client.memberGetDisplayNameByID(guildMember.id)), message.channel);

            this.client.memberLogBan(guildMember.id, message.author.id, args.reason);
            await errorMessage(this.client.textes.get("USER_BAN_NOTIFICATION_TO_USER", this.client.memberGetDisplayNameByID(message.author.id), args.reason), guildMember, false);
            await guildMember.ban({ days: 0, reason: args.reason });
            this.client.serverBanNotification(guildMember.user, message.author, args.reason);
            successMessage(this.client.textes.get("USER_BAN_CHECK_SUCCESS", guildMember), message.channel);
        } else {
            warnMessage(this.client.textes.get("COM_ACTION_ANNULLE"), message.channel);
        }

    }
}


module.exports = BanCommand;