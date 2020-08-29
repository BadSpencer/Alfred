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
        client.log(`EVENT: ${this.emitter}/${this.event}`, "debug");
        if (user.bot) return;

        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = client.getSettings();
        const member = guild.members.cache.get(user.id);

        client.log(client.textes.get("LOG_EVENT_REACTION_ADD", messageReaction, member));


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


        if (messageReaction.message.member !== member) {
            client.userdataAddXP(member, "REACTOUT", 5);


            // Réaction positive
            if (emojis.positive.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "positive" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (20)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 20);
            };

            if (emojis.positiveHand.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "positiveHand" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (20)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 20);
            };

            if (emojis.positivePlus.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "positivePlus" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (30)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 30);
            };

            if (emojis.neutral.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "neutral" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (10)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 10);
            };
            
            if (emojis.neutralHand.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "neutralHand" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (10)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 10);
            };

            if (emojis.bad.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "bad" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (5)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 5);
            };

            if (emojis.badHand.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "badHand" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (5)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 5);
            };
            
            if (emojis.sad.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "sad" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (10)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 10);
            };

            if (emojis.love.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "love" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (50)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 50);
            };

            if (emojis.sweet.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "sweet" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (25)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 25);
            };

            if (emojis.drink.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "drink" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (15)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 15);
            };

            if (emojis.flower.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "flower" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (20)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 20);
            };

            if (emojis.event.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "event" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (10)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 10);
            };

            if (emojis.medal.includes(messageReaction.emoji.name)) {
                client.log(`Réaction "medal" reçue pour ${messageReaction.message.member.displayName} par ${member.displayName} (100)`, "debug");
                client.userdataAddXP(messageReaction.message.member, "REACTIN", 100);
            };




        }



    }
}

module.exports = MessageReactionAddListener;