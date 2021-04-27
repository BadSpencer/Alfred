const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const { Permissions } = require("discord.js");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../utils/messages');
const textes = new (require("../../utils/textes.js"));
const colors = require('../../utils/colors');


class KickCommand extends Command {
    constructor() {
        super('open', {
            aliases: ['open'],
            category: 'Utilitaires',
            description: {
                content: '🔹 Ouvrir le salon vocal où vous vous trouvez au groupe "Invités"',
                usage: `\`!open\`
                Cette va donner les droits au groupe "Invités" de se connecter dans le salon vocal où vous vous trouvez`,
                examples: [`!open`]
            }
        });
    }

    *args(message) {

    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.getGuild();
        let member = client.memberGet(message.author.id);

        let embed = new Discord.MessageEmbed();

        let verifiedRole = guild.roles.cache.find(c => c.name === message.settings.verifiedRole);

        if (client.db_freeVoiceChannels.has(member.voice.channel.id)) {

            await member.voice.channel.createOverwrite(verifiedRole, {
                CONNECT: true,
                SPEAK: true,
                USE_VAD: true
            });
        } else {
            errorMessage('Vous ne pouvez pas ouvrir ce salon aux invités. Veuillez en créer un à vous !', member);
        }




    }
}


module.exports = KickCommand;