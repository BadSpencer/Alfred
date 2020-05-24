const {
    Command
} = require('discord-akairo');
const Discord = require("discord.js");

class SuggestionCommand extends Command {
    constructor() {
        super('suggestion', {
            aliases: ['suggestion', 'sugg', 'sug'],
            category: 'Utilitaires',
            args: [
                {
                    id: 'suggestion',
                    match: 'content'
                }
            ],
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



    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        let suggChannel = guild.channels.cache.find(c => c.name === settings.suggChannel);

        if (!suggChannel) return;

        /*
        if (message.channel.type !== "dm") {
            if (message.channel.type === 'text') message.delete();;
        }
        */

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
        embed.setFooter(client.textes.get("SUGG_NOTIF_PROPOSED_BY", member), avatar);
        embed.setTimestamp();

        if (message.channel.type === 'text') message.delete();;

        return suggChannel.send(embed).then(async msgSent => {
            await msgSent.react("💚");
            await msgSent.react("💛");
            await msgSent.react("💔");
        })

    }


}


module.exports = SuggestionCommand;