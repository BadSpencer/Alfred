const {
    Listener
} = require("discord-akairo");
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
            event: 'messageReactionRemove'
        });
    }

    async exec(messageReaction, user) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, "debug");
        if (user.bot) return;

        const guild = client.getGuild();
        const settings = client.getSettings(guild);
        const member = guild.members.cache.get(user.id);

        if (!messageReaction.message.author.bot) {
            client.log(client.textes.get("LOG_EVENT_REACTION_REMOVE", messageReaction, member));
        }

        let postedEmbed = client.db_postedEmbeds.get(messageReaction.message.id);
        if (postedEmbed) {
            switch (messageReaction.emoji.name) {
                case '▶️': {
                    let totalPages = postedEmbed.pages.length;
                    let indexNewPage = postedEmbed.currentPage;
                    if (indexNewPage == totalPages) return;

                    let newEmbed = postedEmbed.pages[indexNewPage].embed;
                    messageReaction.message.edit(newEmbed);


                    postedEmbed.currentPage = indexNewPage + 1;
                    this.client.db_postedEmbeds.set(messageReaction.message.id, postedEmbed);
                    break;
                }
                case '◀️': {
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






    }
}

module.exports = MessageReactionRemoveListener;