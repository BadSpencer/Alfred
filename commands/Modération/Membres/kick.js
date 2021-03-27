const { Command } = require("discord-akairo");
const { Permissions } = require("discord.js");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../../utils/messages');
const colors = require('../../../utils/colors');


class KickCommand extends Command {
    constructor() {
        super('kick', {
            aliases: ['kick'],
            category: '🟪 Membres',
            description: {
                content: 'Expulser un membre (peut revenir)',
                usage: '',
                examples: ['']
            }
        });
    }

    * args(message) {
    const userdata = yield {
        type: 'userdata',
        prompt: {
            start: message => promptMessage('Quel membre souhaitez vous expulser ?'),
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

        if (!guildMember) return errorMessage(this.client.textes.get("USER_ERROR_NOT_A_MEMBER", args.userdata.displayName, message.channel));

        if (args.confirmation == 'oui') {
            if (guildMember.hasPermission(Permissions.FLAGS.MANAGE_GUILD)) return errorMessage(this.client.textes.get("USER_ERROR_NOT_KICKABLE", guildMember.displayName), message.channel);
            if (guildMember.hasPermission(Permissions.FLAGS.MANAGE_MESSAGES)) return errorMessage(this.client.textes.get("USER_ERROR_NOT_KICKABLE", guildMember.displayName), message.channel);

            this.client.memberLogKick(guildMember.id, message.author.id, args.reason);
            warnMessage(this.client.textes.get("USER_KICK_NOTIFICATION_TO_USER", this.client.memberGetDisplayNameByID(message.author.id), args.reason), guildMember, false);
            await guildMember.kick(args.reason);

            successMessage(this.client.textes.get("USER_KICK_CHECK_SUCCESS", guildMember), message.channel);
        } else {
            warnMessage(this.client.textes.get("COM_ACTION_ANNULLE"), message.channel);
        }

    }
}


module.exports = KickCommand;