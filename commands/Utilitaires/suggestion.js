const {
    Command
} = require("discord-akairo");
const Discord = require("discord.js");
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage, stateMessage } = require('../../utils/messages');

class SuggestionCommand extends Command {
    constructor() {
        super('suggestion', {
            aliases: ['suggestion', 'sugg', 'sug'],
            channel: 'dm',
            category: 'Utilitaires',
            description: {
                content: 'Permet de soumettre une suggestion dans <#688062451228475428>',
                usage: `\`!suggestion <ma suggestion>\`\n
                    Vous pouvez utiliser cette commande directement dans <#688062451228475428> ou bien directement ici par message privé.
                    Votre suggestion apparaitra dans le salon sous un format particulier avec les réactions 💚💛💔. Les réactions permettront de recceuillir l\'avis des membres, elle auront évidement un poid dans la balance de la décision finale.`
                ,
                examples: [
                    '!suggestion Que pensez-vous d\'ajouter le mod **Super mod** sur Ark ?',
                    '!sugg Et si on créait des salons pour **New Game** qui arrive bientôt ?',
                    '!sug Je propose de créer #Imprimantes-3D pour soulager #media-flood!'
                ]
            }
        });
    }

    *args(message) {
        const suggestion = yield {
            type: 'string',
            match: 'content',
            prompt: {
                start: message => promptMessage('Quelle est votre suggestion ?')
            }
        };
        const validation = yield {
            type: 'string',
            match: 'option',
            flag: '--post',
            prompt: {
                start: async message => {
                    let embed = new Discord.MessageEmbed();
                    let avatar;
                    if (!message.author.avatarURL()) {
                        avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
                    } else {
                        avatar = message.author.avatarURL();
                    }

                    embed.setTitle(this.client.textes.get("SUGG_NOTIF_TITLE"));
                    embed.setThumbnail("https://i.imgur.com/VQHvSKr.png");
                    embed.setDescription(suggestion);
                    embed.setFooter(this.client.textes.get("SUGG_NOTIF_PROPOSED_BY", this.client.memberGetDisplayNameByID(message.author.id)), avatar);
                    embed.setTimestamp();
                    message.channel.send(embed).then(async msgSent => {
                        await msgSent.react("💚");
                        await msgSent.react("💛");
                        await msgSent.react("💔");
                    });
                    return promptMessage(`Est ce que ça vous convient ? (oui/non)
                    En répondant **'oui'** votre suggestion sera postée dans le salon "Suggestions" du discord`)
                },
                retry: message => promptMessage(`oui pour valider... `),
            }
        };
        return { suggestion, validation };
    }


    async exec(message, args) {
        let client = this.client;
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (args.validation === "oui") {

            let suggChannel = guild.channels.cache.find(c => c.name === settings.suggChannel);

            if (!suggChannel) return;

            let member = guild.members.cache.get(message.author.id);

            let embed = new Discord.MessageEmbed();

            let avatar;
            if (!member.user.avatarURL()) {
                avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
            } else {
                avatar = member.user.avatarURL();
            }

            embed.setTitle(client.textes.get("SUGG_NOTIF_TITLE"));
            embed.setThumbnail("https://i.imgur.com/VQHvSKr.png");
            embed.setDescription(args.suggestion);
            embed.setFooter(client.textes.get("SUGG_NOTIF_PROPOSED_BY", client.memberGetDisplayNameByID(message.author.id)), avatar);
            embed.setTimestamp();

            if (message.channel.type === 'text') message.delete();

            return suggChannel.send(embed).then(async msgSent => {
                await msgSent.react("💚");
                await msgSent.react("💛");
                await msgSent.react("💔");
            })
        } else {
            message.channel.send(`D'accord, recommencez quand vous voulez !`);

        }
    }
}


module.exports = SuggestionCommand;