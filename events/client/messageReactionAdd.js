const {
    Listener
} = require("discord-akairo");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require("../../utils/messages");
const Discord = require("discord.js");
const emojis = require("../../utils/emojis");
const Client = require("ftp");

class MessageReactionAddListener extends Listener {
    constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            event: 'messageReactionAdd'
        });
    }

    async exec(messageReaction, user) {
        let client = this.client;
        if (user.bot) return;


        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const member = guild.members.cache.get(user.id);

        const modRole = client.roleModGet(guild, settings);

        if (!messageReaction.message.author.bot) {
            client.log(client.textes.get("LOG_EVENT_REACTION_ADD", messageReaction, member));
        }


        let postedEmbed = client.db_postedEmbeds.get(messageReaction.message.id);
        if (postedEmbed) {
            switch (messageReaction.emoji.name) {
                case '▶️': {
                    let totalPages = postedEmbed.pages.length;
                    let indexNewPage = postedEmbed.currentPage;
                    if (indexNewPage == totalPages) return;

                    let newEmbed = postedEmbed.pages[indexNewPage].embed;
                    await messageReaction.message.edit(newEmbed);

                    if (messageReaction.message.channel.type === "text") {
                        await messageReaction.message.reactions.removeAll();
                        if (postedEmbed.currentPage !== totalPages) {
                            await messageReaction.message.react(`◀️`);
                            await messageReaction.message.react(`▶️`);
                        } else {
                            await messageReaction.message.react(`◀️`);
                            await messageReaction.message.react(`⏹`);
                        }
                    }


                    postedEmbed.currentPage = indexNewPage + 1;
                    this.client.db_postedEmbeds.set(messageReaction.message.id, postedEmbed);
                    break;
                }
                case '◀️': {
                    let totalPages = postedEmbed.pages.length;
                    if (postedEmbed.currentPage == 1) return;
                    let indexNewPage = postedEmbed.currentPage - 2;
                    let newEmbed = postedEmbed.pages[indexNewPage].embed;
                    await messageReaction.message.edit(newEmbed);

                    if (messageReaction.message.channel.type === "text") {
                        await messageReaction.message.reactions.removeAll();
                        if (postedEmbed.currentPage !== 1) {
                            await messageReaction.message.react(`◀️`);
                            await messageReaction.message.react(`▶️`);
                        } else {
                            await messageReaction.message.react(`⏹`);
                            await messageReaction.message.react(`▶️`);
                        }
                    }
                    postedEmbed.currentPage = indexNewPage + 1;
                    this.client.db_postedEmbeds.set(messageReaction.message.id, postedEmbed);
                    break;
                }
            }

        }

        if (messageReaction.message.id == settings.gameJoinMessage) {
            const game = client.db_games.find(game => game.emoji == messageReaction.emoji.name);
            if (game) {
                const gameRole = guild.roles.cache.get(game.roleID);
                if (gameRole) {
                    if (member.roles.cache.has(gameRole.id)) {
                        member.roles.remove(gameRole);
                        successMessage(client.textes.get("GAMES_QUIT_SUCCESS", game.name), member);
                    } else {
                        member.roles.add(gameRole);
                        successMessage(client.textes.get(`GAMES_JOIN_SUCCESS`, game.name), member);
                    }
                }
            } else {
                // Jeu non trouvé avec emoji
            }
        }


        if (messageReaction.message.member !== member && !messageReaction.message.author.bot) {




            client.memberLogReactOut(member.id, messageReaction.message.author.id, messageReaction.message, messageReaction.emoji.name);

            if (emojis.positive.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 20);
            };
            if (emojis.positiveHand.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 20);
            };
            if (emojis.positivePlus.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 30);
            };
            if (emojis.neutral.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 10);
            };
            if (emojis.neutralHand.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 10);
            };
            if (emojis.bad.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 5);
            };
            if (emojis.badHand.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 5);
            };
            if (emojis.sad.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 10);
            };
            if (emojis.love.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 50);
            };
            if (emojis.sweet.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 25);
            };
            if (emojis.drink.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 15);
            };
            if (emojis.flower.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 20);
            };
            if (emojis.event.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 10);
            };
            if (emojis.medal.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.author.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 100);
            };


            if (emojis.modwarn.includes(messageReaction.emoji.name)) {
                if (member.roles.cache.has(modRole.id)) {
                    client.memberLogWarn(messageReaction.message.author.id, member.id, `Message dans <#${messageReaction.message.channel.id}`);
                    let embed = new Discord.MessageEmbed();

                    let userdata = client.userdataGet(messageReaction.message.author.id);
                    userdata.warn += 1;
                    client.userdataSet(userdata);

                    embed.setDescription(`Vous avez reçu un avertissement de la part de <@${member.id}>\n\nPour votre message dans <#${messageReaction.message.channel.id}>
                    **Contenu**: ${messageReaction.message.cleanContent.substring(0, 200)}`);
                    embed.setFooter(`Nombre total d'avertissement: ${userdata.warn}`);
                    embed.setAuthor('Avertissement', 'https://cdn.discordapp.com/attachments/552008545231568897/824653538495955004/26A0.png');
                    messageReaction.message.member.send(embed);

                    client.modLogEmbed(`<@${member.id}> à donnée un avertissment à <@${messageReaction.message.author.id}> pour son message

                    Le message à été supprimé.
                    
                    **Contenu**: ${messageReaction.message.cleanContent.substring(0, 200)}`);

                    messageReaction.message.delete();
                } else {
                    messageReaction.remove();
                }
            };

            if (emojis.userwarn.includes(messageReaction.emoji.name)) {
                if (member.roles.cache.has(modRole.id)) {
                    messageReaction.message.delete();
                    client.modLogEmbed(`<@${member.id}> est intervenu sur le message de <@${messageReaction.message.author.id}>

                    Le message à été supprimé.
                    
                    **Contenu**: ${messageReaction.message.cleanContent.substring(0, 200)}`, 'MODWARN');

                    messageReaction.message.delete();
                } else {
                    if (messageReaction.count > 2) {
                        messageReaction.message.delete();
                        client.modLogEmbed(`<@${member.id}> à signalé ce message de <@${messageReaction.message.author.id}>

                        C'est la troisième notification de membre sur ce message. Le message à été supprimé.
                        
                        **Contenu**: ${messageReaction.message.cleanContent.substring(0, 200)}`, 'MODWARN');

                    } else {
                        client.modLogEmbed(`<@${member.id}> à signalé le message de <@${messageReaction.message.author.id}>
                        
                        **Lien**: ${messageReaction.message.url}`, 'MODWARN');
                    }
                }


            }

            if (emojis.rulesValidation.includes(messageReaction.emoji.name)) {
                let joinChannel = guild.channels.cache.find(c => c.name === settings.joinChannel);
                await joinChannel.createOverwrite(member, {
                    SEND_MESSAGES: true
                });
            }

        }

    }
}

module.exports = MessageReactionAddListener;