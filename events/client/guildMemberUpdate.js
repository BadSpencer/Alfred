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

        client.log(client.textes.get("DEBUG_EVENT_GUILD_MEMBER_UPDATE", newMember), "debug");
        let userdata = client.db_userdata.get(newMember.id);

        if (newMember.displayName !== oldMember.displayName) {
            client.userdataAddLog(userdata, newMember, "NICK", `${oldMember.displayName} -> ${newMember.displayName}`);
        }


        // Role ajouté
        if (newMember.roles.size > oldMember.roles.size) {

            newMember.roles.forEach(newRole => {
                if (!oldMember.roles.has(newRole.id)) {
                    client.log(client.textes.get("LOG_EVENT_USER_ADD_ROLE", newMember, newRole));

                    // Gestion de l'annonce spécifique lorsqu'on rejoint le groupe "Membres"
                    if (newRole.id == roleMembers.id) {
                        client.userdataAddLog(userdata, newMember, "MEMBER", "A été ajouté au groupe des membres");
                    }
                    if (newRole.id == roleMembers.id && settings.welcomeMemberEnabled == "true") {
                        client.newMemberNotification(newMember);
                        client.newMemberWelcome(newMember);
                    }
                    // Annonce rejoindre jeu
                    const game = client.db_games.find(game => game.roleID == newRole.id);
                    if (game) {
                        client.games.PostRoleReaction(client);

                        client.usergameUpdateJoinedAt(game, newMember);

                        client.games.newPlayerNotification(client, game, newMember);
                        client.userdataAddLog(userdata, newMember, "GAMEJOIN", `A rejoint le groupe "${game.name}"`);
                    }
                }
            });
        }


        // Role retiré
        if (newMember.roles.size < oldMember.roles.size) {


            oldMember.roles.forEach(oldRole => {
                if (!newMember.roles.has(oldRole.id)) {
                    client.log(client.textes.get("LOG_EVENT_USER_REMOVE_ROLE", newMember, oldRole));

                    const game = client.db_games.find(game => game.roleID == oldRole.id);
                    if (game) {
                        client.games.PostRoleReaction(client);
                        client.games.quitPlayerNotification(client, game, newMember);
                        client.userdataAddLog(userdata, oldMember, "GAMEQUIT", `A quitté le groupe "${game.name}"`);
                    }
                }
            })
        }


    }
}

module.exports = guildMemberUpdateListener;