const {
    Listener
} = require('discord-akairo');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../../utils/messages');

const emojis = require('../../utils/emojis');

class MessageReactionAddListener extends Listener {
    constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            eventName: 'messageReactionAdd'
        });
    }

    async exec(messageReaction, user) {

        let gameGroupsBlacklist = [
            '191993511543832577', // Albator
            '502561242049806336'  // Bad Weuiser
        ];




        let client = this.client;
        if (user.bot) return;

        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);
        const member = guild.members.get(user.id);

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
                    // await messageReaction.message.clearReactions();

                    postedEmbed.currentPage = indexNewPage + 1;
                    // if (postedEmbed.currentPage !== totalPages) {
                    //     await messageReaction.message.react(`◀️`);
                    //     await messageReaction.message.react(`▶️`);
                    // } else {
                    //     await messageReaction.message.react(`◀️`);
                    //     await messageReaction.message.react(`⏹`);
                    // }
                    this.client.db_postedEmbeds.set(messageReaction.message.id, postedEmbed);
                    break;
                }
                case '◀️': {
                    let totalPages = postedEmbed.pages.length;
                    if (postedEmbed.currentPage == 1) return;
                    let indexNewPage = postedEmbed.currentPage - 2;
                    let newEmbed = postedEmbed.pages[indexNewPage].embed;
                    await messageReaction.message.edit(newEmbed);
                    // await messageReaction.message.clearReactions();
                    postedEmbed.currentPage = indexNewPage + 1;
                    // if (postedEmbed.currentPage !== 1) {
                    //     await messageReaction.message.react(`◀️`);
                    //     await messageReaction.message.react(`▶️`);
                    // } else {
                    //     await messageReaction.message.react(`⏹`);
                    //     await messageReaction.message.react(`▶️`);
                    // }
                    this.client.db_postedEmbeds.set(messageReaction.message.id, postedEmbed);
                    break;
                }
            }

        }

        if (messageReaction.message.id == settings.gameJoinMessage) {
            const game = client.db_games.find(game => game.emoji == messageReaction.emoji.name);
            if (game) {
                const gameRole = guild.roles.get(game.roleID);
                if (gameRole) {
                    if (member.roles.has(gameRole.id)) {
                        if (gameGroupsBlacklist.includes(member.id)) {
                            member.send(client.textes.get("GAMES_MEMBER_BLACKLISTED"));
                        } else {
                            client.games.quitConfirmation(client, messageReaction, game, member);
                        }

                    } else {
                        if (gameGroupsBlacklist.includes(member.id)) {
                            member.send(client.textes.get("GAMES_MEMBER_BLACKLISTED"));
                        } else {
                            member.addRole(gameRole);
                            successMessage(client.textes.get(`GAMES_JOIN_SUCCESS`, game.name), messageReaction.message.channel);
                        }
                    }
                }
            } else {
                // Jeu non trouvé avec emoji
            }
        }


        if (messageReaction.message.member !== member) {
            client.db.userdataAddXP(client, member, 5, `Réaction à un message`);


            if (emojis.positive.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 20, `Réaction "positive" reçue`);
            if (emojis.positiveHand.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 20, `Réaction "positiveHand" reçue`);
            if (emojis.positivePlus.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 30, `Réaction "positivePlus" reçue`);
            if (emojis.neutral.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 10, `Réaction "neutral" reçue`);
            if (emojis.neutralHand.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 10, `Réaction "neutralHand" reçue`);
            if (emojis.bad.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 5, `Réaction "bad" reçue`);
            if (emojis.badHand.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 5, `Réaction "badHand" reçue`);
            if (emojis.sad.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 10, `Réaction "sad" reçue`);
            if (emojis.love.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 50, `Réaction "love" reçue`);
            if (emojis.sweet.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 25, `Réaction "sweet" reçue`);
            if (emojis.drink.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 15, `Réaction "drink" reçue`);
            if (emojis.flower.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 20, `Réaction "flower" reçue`);
            if (emojis.event.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 10, `Réaction "event" reçue`);
            if (emojis.medal.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, messageReaction.message.member, 100, `Réaction "medal" reçue`);



        }



    }
}

module.exports = MessageReactionAddListener;