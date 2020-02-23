const {
    Listener
} = require('discord-akairo');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../../utils/messages');

const textes = require('../../utils/textes');

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
                        warnMessage(client.textes.get(`GAMES_JOIN_ALREADY_IN`, game.name), messageReaction.message.channel);

                        let statusMessage = await questionMessage(client.textes.get("GAMES_JOIN_WANT_TO_QUIT", game.name), messageReaction.message.channel);
                        const responses = await messageReaction.message.channel.awaitMessages(msg => msg.author.id === member.id, {
                            max: 1,
                            time: 10000,
                        });

                        if (responses.size !== 1) {
                            warnMessage(client.textes.get("COM_ACTION_ANNULLE"), messageReaction.message.channel);
                            return null;
                        }
                        const response = responses.first();

                        if (response.content == "oui") {
                            response.delete();
                            member.removeRole(gameRole);
                            successMessage(client.textes.get("GAMES_QUIT_SUCCESS", game.name), messageReaction.message.channel);
                        } else {
                            response.delete();
                            warnMessage(client.textes.get("COM_ACTION_ANNULLE"), messageReaction.message.channel);
                            return null;
                        }

                    } else {
                        member.addRole(gameRole);
                        successMessage(client.textes.get(`GAMES_JOIN_SUCCESS`, game.name), messageReaction.message.channel);
                    }
                } else {
                    // Erreur role principal jeu
                }

            } else {
                // Jeu non trouvé avec emoji
            }
        }





    }
}

module.exports = MessageReactionAddListener;