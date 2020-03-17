const {
    Command
} = require('discord-akairo');
const Discord = require("discord.js");

class SuggestionCommand extends Command {
    constructor() {
        super('suggestion', {
            aliases: ['suggestion', 'sug'],
            category: 'Utilitaires',
            args: [
                {
                    id: 'suggestion',
                    match: 'content'
                }
            ]
        });
    }



    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);

        let suggChannel = guild.channels.find(c => c.name === settings.suggChannel);

        if (!suggChannel) return;

        /*
        if (message.channel.type !== "dm") {
            message.delete();
        }
        */

        let member = guild.members.get(message.author.id);

        let embed = new Discord.RichEmbed();

        let avatar;
        if (!member.user.avatarURL) {
            avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
        } else {
            avatar = member.user.avatarURL;
        }

        embed.setTitle(client.textes.get("SUGG_NOTIF_TITLE"));
        embed.setThumbnail("https://i.imgur.com/VQHvSKr.png");
        embed.setDescription(args.suggestion);
        embed.setFooter(client.textes.get("SUGG_NOTIF_PROPOSED_BY", member), avatar);
        embed.setTimestamp();

        message.delete();
        
        return suggChannel.send(embed).then(async msgSent => {
            await msgSent.react("✅");
            await msgSent.react("❌");
        })

    }


}


module.exports = SuggestionCommand;