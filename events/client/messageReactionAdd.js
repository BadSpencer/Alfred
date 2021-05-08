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
        client.log(`EVENT: ${this.emitter}/${this.event}`, "debug");
        if (user.bot) return;


        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const member = guild.members.cache.get(user.id);

        const modRole = client.roleModGet(guild, settings);

        let message;
        if (messageReaction.message.channel.type === 'text') {
            let messageChannel = guild.channels.cache.get(messageReaction.message.channel.id);
            message = await messageChannel.messages.fetch(messageReaction.message.id);
            if (message) {
                client.log(`Message correctement fetché`, "debug");
            }
        } else {
            message = messageReaction.message;
            client.log(`Utilisation de messageReaction.message`, "debug");
        }


        if (!message.author.bot) {
            client.log(client.textes.get("LOG_EVENT_REACTION_ADD", messageReaction, member));
        }


        let postedEmbed = client.db_postedEmbeds.get(message.id);
        if (postedEmbed) {
            client.log(`C'est un 'postedembed'`, "debug");
            switch (messageReaction.emoji.name) {
                case '▶️': {
                    let totalPages = postedEmbed.pages.length;
                    let indexNewPage = postedEmbed.currentPage;
                    if (indexNewPage == totalPages) return;

                    let newEmbed = postedEmbed.pages[indexNewPage].embed;
                    await message.edit(newEmbed);

                    if (message.channel.type === "text") {
                        await message.reactions.removeAll();
                        if (postedEmbed.currentPage !== totalPages) {
                            await message.react(`◀️`);
                            await message.react(`▶️`);
                        } else {
                            await message.react(`◀️`);
                            await message.react(`⏹`);
                        }
                    }


                    postedEmbed.currentPage = indexNewPage + 1;
                    this.client.db_postedEmbeds.set(message.id, postedEmbed);
                    break;
                }
                case '◀️': {
                    let totalPages = postedEmbed.pages.length;
                    if (postedEmbed.currentPage == 1) return;
                    let indexNewPage = postedEmbed.currentPage - 2;
                    let newEmbed = postedEmbed.pages[indexNewPage].embed;
                    await message.edit(newEmbed);

                    if (message.channel.type === "text") {
                        await message.reactions.removeAll();
                        if (postedEmbed.currentPage !== 1) {
                            await message.react(`◀️`);
                            await message.react(`▶️`);
                        } else {
                            await message.react(`⏹`);
                            await message.react(`▶️`);
                        }
                    }
                    postedEmbed.currentPage = indexNewPage + 1;
                    this.client.db_postedEmbeds.set(message.id, postedEmbed);
                    break;
                }
            }

        }

        if (message.id == settings.gameJoinMessage) {
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


        if (message.author.id != member.id && !message.author.bot) {
            client.log(`Message valide pour analyse emoji`, "debug");

            client.memberLogReactOut(member.id, message.author.id, message, messageReaction.emoji.name);

            if (emojis.positive.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 20);
            };
            if (emojis.positiveHand.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 20);
            };
            if (emojis.positivePlus.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 30);
            };
            if (emojis.neutral.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 10);
            };
            if (emojis.neutralHand.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 10);
            };
            if (emojis.bad.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 5);
            };
            if (emojis.badHand.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 5);
            };
            if (emojis.sad.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 10);
            };
            if (emojis.love.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 50);
            };
            if (emojis.sweet.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 25);
            };
            if (emojis.drink.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 15);
            };
            if (emojis.flower.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 20);
            };
            if (emojis.event.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 10);
            };
            if (emojis.medal.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(message.author.id, member.id, message, messageReaction.emoji.name, null, 100);
            };


            if (emojis.modwarn.includes(messageReaction.emoji.name)) {
                if (member.roles.cache.has(modRole.id)) {
                    client.memberLogWarn(message.author.id, member.id, `Message dans <#${message.channel.id}`);
                    let embed = new Discord.MessageEmbed();

                    let userdata = client.userdataGet(message.author.id);
                    userdata.warn += 1;
                    client.userdataSet(userdata);

                    embed.setDescription(`Vous avez reçu un avertissement de la part de <@${member.id}>\n\nPour votre message dans <#${message.channel.id}>
                    **Contenu**: ${message.cleanContent.substring(0, 200)}`);
                    embed.setFooter(`Nombre total d'avertissement: ${userdata.warn}`);
                    embed.setAuthor('Avertissement', 'https://cdn.discordapp.com/attachments/552008545231568897/824653538495955004/26A0.png');
                    message.author.send(embed);

                    client.modLogEmbed(`<@${member.id}> à donnée un avertissment à <@${message.author.id}> pour son message

                    Le message à été supprimé.
                    
                    **Contenu**: ${message.cleanContent.substring(0, 200)}`);

                    message.delete();
                } else {
                    messageReaction.remove();
                }
            };

            if (emojis.userwarn.includes(messageReaction.emoji.name)) {
                if (member.roles.cache.has(modRole.id)) {
                    client.modLogEmbed(`<@${member.id}> est intervenu sur le message de <@${message.author.id}>

                    Le message à été supprimé.
                    
                    **Contenu**: ${message.cleanContent.substring(0, 200)}`, 'MODWARN');
                    message.delete();
                } else {
                    if (messageReaction.count > 2) {
                        
                        client.modLogEmbed(`<@${member.id}> à signalé ce message de <@${messageReaction.message.author.id}>

                        C'est la troisième notification de membre sur ce message. Le message à été supprimé.
                        
                        **Contenu**: ${messageReaction.message.cleanContent.substring(0, 200)}`, 'MODWARN');
                        message.delete();
                    } else {
                        client.modLogEmbed(`<@${member.id}> à signalé le message de <@${messageReaction.message.author.id}>
                        
                        **Lien**: ${messageReaction.message.url}`, 'MODWARN');
                    }
                }
            }

            if (emojis.rulesValidation.includes(messageReaction.emoji.name) && message.id === settings.rulesMessageID) {
                client.log(`${member.displayName} à validé règlement`);
                let joinChannel = guild.channels.cache.find(c => c.name === settings.joinChannel);
                let permissions = joinChannel.permissionOverwrites.get(member.id);
                if (permissions) {
                    permissions.delete();
                }
            }

        }

    }
}

module.exports = MessageReactionAddListener;