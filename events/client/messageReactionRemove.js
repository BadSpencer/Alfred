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



        if (messageReaction.message.id == settings.gameJoinMessage) {
            const game = this.client.db_games.find(game => game.emoji == messageReaction.emoji.name);
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
                            successMessage(client.textes.get("COM_ACTION_ANNULLE"), messageReaction.message.channel);
                            return null;
                        }
                    } else {
                    }
                } else {
                    
                }

            } else {
                // Jeu non trouvé avec emoji
            }
        }






    }
}

module.exports = MessageReactionRemoveListener;