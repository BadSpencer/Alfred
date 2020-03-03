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

class MessageReactionRemoveListener extends Listener {
    constructor() {
        super('messageReactionRemove', {
            emitter: 'client',
            eventName: 'messageReactionRemove'
        });
    }

    async exec(messageReaction, user) {
        let client = this.client;
        if (user.bot) return;

        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);
        const member = guild.members.get(user.id);

        client.logger.log(client.textes.get("LOG_EVENT_REACTION_REMOVE", messageReaction, member));

        let postedEmbed = client.db_postedEmbeds.get(messageReaction.message.id);
        if (postedEmbed) {
            switch (messageReaction.emoji.name) {
                case '▶': {
                    let totalPages = postedEmbed.pages.length;
                    let indexNewPage = postedEmbed.currentPage;
                    if (indexNewPage == totalPages) return;

                    let newEmbed = postedEmbed.pages[indexNewPage].embed;
                    messageReaction.message.edit(newEmbed);
                    postedEmbed.currentPage = indexNewPage + 1;
                    this.client.db_postedEmbeds.set(messageReaction.message.id, postedEmbed);
                    break;
                }
                case '◀': {
                    let totalPages = postedEmbed.pages.length;
                    if (postedEmbed.currentPage == 1) return;
                    let indexNewPage = postedEmbed.currentPage - 2;
                    let newEmbed = postedEmbed.pages[indexNewPage].embed;
                    messageReaction.message.edit(newEmbed);
                    postedEmbed.currentPage = indexNewPage + 1;
                    this.client.db_postedEmbeds.set(messageReaction.message.id, postedEmbed);
                    break;
                }
            }

        }

        if (messageReaction.message.id == settings.gameJoinMessage) {
            const game = this.client.db_games.find(game => game.emoji == messageReaction.emoji.name);
            if (game) {
                const gameRole = guild.roles.get(game.roleID);
                if (gameRole) {
                    if (member.roles.has(gameRole.id)) {
                        client.games.quitConfirmation(client, messageReaction,  game, member);
                    } else {
                        member.addRole(gameRole);
                        successMessage(client.textes.get(`GAMES_JOIN_SUCCESS`, game.name), messageReaction.message.channel);
                    }
                } 
            } else {
                // Jeu non trouvé avec emoji
            }
        }






    }
}

module.exports = MessageReactionRemoveListener;