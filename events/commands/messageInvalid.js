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
            await this.client.messageLog(message);
            this.client.memberLogText(message.author.id, message);
            let games = client.db_games.filterArray((game) => game.textChannelID == message.channel.id);
            for (const game of games) {
                if (message.member.roles.cache.has(game.roleID)) {
                    await client.usergameUpdateLastAction(game, message.member);
                };
            };

        };

        if (message.channel.type === 'dm') {
            let userdata = client.userdataGet(message.author.id);
            client.log(`MP envoyé par ${message.author.username}: ${message.cleanContent}`);

            if (message.content.toUpperCase().includes(`MARIO`)) {
                let embed = new Discord.MessageEmbed();

                if (!userdata.verified) {
                    let member = client.memberGet(userdata.id);
                    const guild = client.getGuild();
                    let description = "";

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

                }
            }

        }
    };

}

module.exports = MessageInvalidListener;