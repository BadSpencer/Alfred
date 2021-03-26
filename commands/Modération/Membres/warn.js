const {
    Command
} = require("discord-akairo");
const { Permissions } = require("discord.js");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require('../../../utils/messages');
const Discord = require("discord.js");
const colors = require('../../../utils/colors');
const textes = new (require(`../../../utils/textes.js`));

class NoteCommand extends Command {
    constructor() {
        super("warn", {
            aliases: ["warn"],
            category: '🟪 Membres',
            description: {
                content: textes.get("USER_WARN_DESCRIPTION_CONTENT"),
                usage: textes.get("USER_WARN_DESCRIPTION_USAGE"),
                examples: ['']
            }
        });
    }

    async *args(message) {
        const userdata = yield {
            type: "userdata",
            prompt: {
                start: message => promptMessage(textes.get('USER_MEMBER_PROMPT')),
                retry: message => promptMessage(textes.get('USER_MEMBER_RETRY'))
            }
        };

        const note = yield {
            type: "string",
            prompt: {
                start: message => promptMessage(textes.get("USER_WARN_NOTE_PROMPT", this.client.memberGetDisplayNameByID(userdata.id)))
            }
        };

        return {
            userdata,
            note
        };
    }

    async exec(message, args) {

        const guild = this.client.getGuild();
        let member = guild.members.cache.get(args.userdata.id);

        args.userdata.warn += 1;
        this.client.userdataSet(args.userdata);

        let embed = new Discord.MessageEmbed();

        embed.setDescription(`Vous avez reçu un avertissement de la part de <@${message.author.id}>\n\nPour la raison: ${args.note}`);
        embed.setFooter(`Nombre total d'avertissement: ${args.userdata.warn}`);
        embed.setAuthor('Avertissement', 'https://cdn.discordapp.com/attachments/552008545231568897/824653538495955004/26A0.png');
        member.send(embed);

        this.client.memberLogWarn(args.userdata.id, message.author.id, args.note);

        this.client.modLogEmbed(this.client.textes.get("MOD_NOTIF_MEMBER_NEW_WARN", args.userdata.id, message.author.id, args.note, args.userdata.warn), 'WARN');


    }
}


module.exports = NoteCommand;