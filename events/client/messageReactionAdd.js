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
        let client = this.client;
        if (user.bot) return;

        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);
        const member = guild.members.get(user.id);

        client.logger.log(client.textes.get("LOG_EVENT_REACTION_ADD", messageReaction, member));


        let postedEmbed = client.db_postedEmbeds.get(messageReaction.message.id);
        if (postedEmbed) {
            switch (messageReaction.emoji.name) {
                case '▶': {
                    let totalPages = postedEmbed.pages.length;
                    let indexNewPage = postedEmbed.currentPage;

                    let newEmbed = postedEmbed.pages[indexNewPage].embed;
                    messageReaction.message.edit(newEmbed);
                    if (indexNewPage == totalPages - 1) {
                        messageReaction.message.clearReactions().then(() => messageReaction.message.react('◀'));
                    } else {
                        messageReaction.message.clearReactions().then(() => messageReaction.message.react('◀')
                            .then(() => messageReaction.message.react('▶')));
                    }
                    postedEmbed.currentPage = indexNewPage + 1;
                    this.client.db_postedEmbeds.set(messageReaction.message.id, postedEmbed);
                    break;
                }
                case '◀': {
                    let totalPages = postedEmbed.pages.length;
                    let indexNewPage = postedEmbed.currentPage - 2;
                    let newEmbed = postedEmbed.pages[indexNewPage].embed;
                    messageReaction.message.edit(newEmbed);
                    if (indexNewPage == 0) {
                        messageReaction.message.clearReactions().then(() => messageReaction.message.react('▶'));
                    } else {
                        messageReaction.message.clearReactions().then(() => messageReaction.message.react('◀')
                            .then(() => messageReaction.message.react('▶')));
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
                const gameRole = guild.roles.get(game.roleID);
                if (gameRole) {
                    if (member.roles.has(gameRole.id)) {
                        client.games.quitConfirmation(client, messageReaction, game, member);
                    } else {
                        member.addRole(gameRole);
                        successMessage(client.textes.get(`GAMES_JOIN_SUCCESS`, game.name), messageReaction.message.channel);
                    }
                }
            } else {
                // Jeu non trouvé avec emoji
            }
        }


        if (messageReaction.message.member !== member) {
            client.db.userdataAddXP(client, member, 5, `Réaction à un message`);


            if (emojis.positive.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 20, `Réaction "positive" reçue`);
            if (emojis.positiveHand.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 20, `Réaction "positiveHand" reçue`);
            if (emojis.positivePlus.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 30, `Réaction "positivePlus" reçue`);
            if (emojis.neutral.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 10, `Réaction "neutral" reçue`);
            if (emojis.neutralHand.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 10, `Réaction "neutralHand" reçue`);
            if (emojis.bad.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 5, `Réaction "bad" reçue`);
            if (emojis.badHand.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 5, `Réaction "badHand" reçue`);
            if (emojis.sad.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 10, `Réaction "sad" reçue`);
            if (emojis.love.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 50, `Réaction "love" reçue`);
            if (emojis.sweet.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 25, `Réaction "sweet" reçue`);
            if (emojis.drink.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 15, `Réaction "drink" reçue`);
            if (emojis.flower.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 20, `Réaction "flower" reçue`);
            if (emojis.event.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 10, `Réaction "event" reçue`);
            if (emojis.medal.includes(messageReaction.emoji.name)) client.db.userdataAddXP(client, member, 100, `Réaction "medal" reçue`);



        }



    }
}

module.exports = MessageReactionAddListener;