const {
    Listener
} = require('discord-akairo');
const {
    successMessage,
    errorMessage,
    warnMessage
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
        if (user.bot) return;

        const guild = this.client.guilds.get(this.client.config.guildID);
        const settings = await this.client.db.getSettings(this.client);
        const member = guild.members.get(user.id);


        let reacted = `${member.displayName} à réagi sur le message ${messageReaction.message.id}`
        this.client.logger.log(`${reacted}`);

        let postedEmbed = this.client.db_postedEmbeds.get(messageReaction.message.id);
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
            const game = this.client.db_games.find(game => game.emoji == messageReaction.emoji.name);
            if (game) {
                const gameRole = guild.roles.get(game.roleID);
                if (gameRole) {
                    if (member.roles.has(gameRole.id)) {
                        warnMessage(textes.games.reactionRoles.dejaDansGroupe.random(), messageReaction.message);
                    } else {
                        member.addRole(gameRole);
                        successMessage(`Vous faites désormais partie du groupe ${game.name}.`, messageReaction.message);
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