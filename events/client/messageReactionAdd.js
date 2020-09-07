const {
    Listener
} = require("discord-akairo");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require("../../utils/messages");

const emojis = require("../../utils/emojis");

class MessageReactionAddListener extends Listener {
    constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            event: 'messageReactionAdd'
        });
    }

    async exec(messageReaction, user) {

        let gameGroupsBlacklist = [
            "000000000000000000" // Null
            //'191993511543832577' // Albator
        ];

        let client = this.client;
        if (user.bot) return;


        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const member = guild.members.cache.get(user.id);

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
                        if (gameGroupsBlacklist.includes(member.id)) {
                            member.send(client.textes.get("GAMES_MEMBER_BLACKLISTED"));
                        } else {
                            client.gameQuitConfirmation(messageReaction, game, member);
                        }
                    } else {
                        if (gameGroupsBlacklist.includes(member.id)) {
                            member.send(client.textes.get("GAMES_MEMBER_BLACKLISTED"));
                        } else {
                            member.roles.add(gameRole);
                            successMessage(client.textes.get(`GAMES_JOIN_SUCCESS`, game.name), messageReaction.message.channel);
                        }
                    }
                }
            } else {
                // Jeu non trouvé avec emoji
            }
        }


        if (messageReaction.message.member !== member && !messageReaction.message.member.user.bot) {
            client.memberLogReactOut(member.id, messageReaction.message.member.id, messageReaction.message, messageReaction.emoji.name);

            if (emojis.positive.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 20);
            };
            if (emojis.positiveHand.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 20);
            };
            if (emojis.positivePlus.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 30);
            };
            if (emojis.neutral.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 10);
            };
            if (emojis.neutralHand.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 10);
            };
            if (emojis.bad.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 5);
            };
            if (emojis.badHand.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 5);
            };
            if (emojis.sad.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 10);
            };
            if (emojis.love.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 50);
            };
            if (emojis.sweet.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 25);
            };
            if (emojis.drink.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 15);
            };
            if (emojis.flower.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 20);
            };
            if (emojis.event.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 10);
            };
            if (emojis.medal.includes(messageReaction.emoji.name)) {
                client.memberLogReactIn(messageReaction.message.member.id, member.id, messageReaction.message, messageReaction.emoji.name, null, 100);
            };

        }

    }
}

module.exports = MessageReactionAddListener;