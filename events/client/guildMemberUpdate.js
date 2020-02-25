const {
    Listener
} = require('discord-akairo');


class guildMemberUpdateListener extends Listener {
    constructor() {
        super('guildMemberUpdate', {
            emitter: 'client',
            eventName: 'guildMemberUpdate'
        });
    }

    async exec(oldMember, newMember) {
        let client = this.client;
        const guild = client.guilds.get(client.config.guildID);
        const settings = await client.db.getSettings(client);
        const roleMembers = newMember.guild.roles.find(r => r.name == settings.memberRole);

        let memberUpdate = `Member update pour ${newMember.displayName}`
        this.client.logger.log(`${memberUpdate}`);



        // Role ajouté
        if (newMember.roles.size > oldMember.roles.size) {
            client.games.PostRoleReaction(client);

            newMember.roles.forEach(newRole => {
                if (!oldMember.roles.has(newRole.id)) {
                    client.logger.log(client.textes.get("COM_MEMBER_ADD_ROLE", newMember, newRole));
                    // Gestion de l'annonce spécifique lorsqu'on rejoint le groupe "Membres"
                    if (newRole.id == roleMembers.id && settings.welcomeMemberEnabled == "true") {
                        client.members.welcomeNewMember(client, member);
                    }
                    // Annonce rejoindre jeu
                    const game = client.db_games.find(game => game.roleID == newRole.id);
                    if (game) {
                        client.games.createUsergame(client, game, newMember);
                        client.games.updateJoinUsergame(client, game, newMember);
                        client.games.newPlayerNotification(client, game, newMember);
                    }
                }
            });
        }


        // Role retiré
        if (newMember.roles.size < oldMember.roles.size) {
            client.games.PostRoleReaction(this.client);

            oldMember.roles.forEach(oldRole => {
                if (!newMember.roles.has(oldRole.id)) {
                    client.logger.log(client.textes.get("COM_MEMBER_REMOVE_ROLE", newMember, oldRole));

                    const game = client.db_games.find(game => game.roleID == oldRole.id);
                    if (game) {
                        client.games.updateQuitUsergame(client, game, newMember);
                        client.games.quitPlayerNotification(client, game, newMember);
                    }
                }
            })
        }

        
    }
}

module.exports = guildMemberUpdateListener;