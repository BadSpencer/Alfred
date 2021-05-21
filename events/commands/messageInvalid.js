const Discord = require("discord.js");
const {
    Listener
} = require("discord-akairo");

class MessageInvalidListener extends Listener {
    constructor() {
        super('messageInvalid', {
            emitter: 'commandHandler',
            event: 'messageInvalid'
        });
    }

    async exec(message) {
        let client = this.client;
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        if (message.author.bot) return;
        if (message.channel.name === settings.commandsChannel) return;
        // if (message.channel.name === settings.commandsTestChannel) return;


        if (message.channel.type === 'text') {
            let games = client.db_games.filterArray((game) => game.textChannelID == message.channel.id);
            for (const game of games) {
                if (message.member.roles.cache.has(game.roleID)) {
                    await client.usergameUpdateLastAction(game, message.member);
                };
            };

        };

        if (message.channel.type === 'dm') {
            let userdata = client.userdataGet(message.author.id);
            let member = client.memberGet(userdata.id);
            const guild = client.getGuild();
            const roleMembers = guild.roles.cache.find(r => r.name === message.settings.memberRole);

            if (!userdata.verified && !member.roles.cache.has(roleMembers.id)) {
                let embed = new Discord.MessageEmbed();
                let description = "";
                if (message.content.toUpperCase().includes(`MARIO`)) {
                    


                    

                    embed.setTitle('Casual Effect');
                    description += `Félicitations ! Vous avez correctement répondu à la question.`;
                    if (settings.welcomeChannelUrl != "") {
                        description += `\n\n[**Retourner sur Casual Effect**](${settings.welcomeChannelUrl})`;
                    }
                    embed.setDescription(description);
                    member.send(embed);


                    userdata.verified = true;
                    client.userdataSet(userdata);

                    let verifiedRole = guild.roles.cache.find(c => c.name === message.settings.verifiedRole);
                    member.roles.add(verifiedRole);

                    client.modLogEmbed(`<@${member.id}> à correctement répondu à l'énigme anti-bot. Il à été ajouté au groupe "**Invités**"`);


                } else {
                    embed.setTitle('Casual Effect');
                    embed.setDescription(`Ce n'est pas vraiment la réponse que j'attendais...`);
                    member.send(embed);
                }
            } else {
                let contactChannel = guild.channels.cache.find(c => c.name === message.settings.contactChannel);
                client.log(`MP envoyé par ${message.author.username}: ${message.cleanContent}`);

                if (contactChannel) {
                    contactChannel.send(`<@${message.author.id}> ${message.cleanContent}`);
                } else {
                    client.log(`Salon "Contact Alfred" non trouvé`, "error");
                }
            }

        }
    };

}

module.exports = MessageInvalidListener;