const {
    Listener
} = require("discord-akairo");


class guildMemberUpdateListener extends Listener {
    constructor() {
        super('guildMemberUpdate', {
            emitter: 'client',
            event: 'guildMemberUpdate'
        });
    }

    async exec(oldMember, newMember) {
        let client = this.client;
        client.log(`EVENT: ${this.emitter}/${this.event}`, "debug");

        const guild = client.guilds.cache.get(client.config.guildID);
        const settings = client.getSettings();
        const roleMembers = newMember.guild.roles.cache.find(r => r.name == settings.memberRole);

        client.log(client.textes.get("DEBUG_EVENT_GUILD_MEMBER_UPDATE", newMember), "debug");
        let userdata = client.db_userdata.get(newMember.id);

        if (newMember.displayName !== oldMember.displayName) {
            client.memberLogNick(newMember.id, oldMember.displayName, newMember.displayName);
            client.modLogEmbed(client.textes.get("MOD_NOTIF_MEMBER_NICK_CHANGE", oldMember.displayName, newMember.displayName));
            userdata.displayName = newMember.displayName;
            userdata.username = newMember.username;
            client.db_userdata.set(userdata.id, userdata);
        }


        // Role ajouté
        if (newMember.roles.cache.size > oldMember.roles.cache.size) {

            newMember.roles.cache.forEach( async newRole => {
                if (!oldMember.roles.cache.has(newRole.id)) {
                    if (!newRole.name.startsWith("Joue à")) {
                    client.log(client.textes.get("LOG_EVENT_USER_ADD_ROLE", newMember, newRole));
                    }

                    // Gestion de l'annonce spécifique lorsqu'on rejoint le groupe "Membres"
                    if (newRole.id == roleMembers.id) {
                        client.memberLogMember(newMember.id);
                    }
                    if (newRole.id == roleMembers.id && settings.welcomeMemberEnabled === true) {
                        client.newMemberNotification(newMember);
                        client.newMemberWelcome(newMember);
                    }
                    // Annonce rejoindre jeu
                    const game = client.gamesGetByRole(newRole);
                    if (game) {
                        client.gamesJoinListPost();

                        client.usergameUpdateJoinedAt(game, newMember);

                        client.gameNewPlayerNotification(game, newMember);

                        client.memberLogGameJoin(newMember.id, game);

                        let player = client.db_gameserversPlayers.find(rec => rec.memberID == newMember.id);
                        if (player) {
                            client.log(`ID ${player.id} trouvé pour membre ${newMember.displayName}`,"debug");

                            let servers = client.db_gameservers.filterArray(rec => rec.gamename == game.id);

                            for (const server of servers) {
                                client.gameServerPlayerUnban(player, server);
                            }
                        }
                    }
                }
            });
        }


        // Role retiré
        if (newMember.roles.cache.size < oldMember.roles.cache.size) {
            oldMember.roles.cache.forEach( async oldRole => {
                if (!newMember.roles.cache.has(oldRole.id)) {
                    if (!oldRole.name.startsWith("Joue à")) {
                    client.log(client.textes.get("LOG_EVENT_USER_REMOVE_ROLE", newMember, oldRole));
                    }

                    const game = client.gamesGetByRole(oldRole);
                    if (game) {

                        client.log(`Membre ${newMember.displayName} à quitté le jeu ${game.id}`,"debug");

                        client.gamesJoinListPost();
                        client.gamePlayerQuitNotification(game, newMember);
                        client.memberLogGameQuit(newMember.id, game);

                        let player = client.db_gameserversPlayers.find(rec => rec.memberID == newMember.id);
                        if (player) {
                            client.log(`ID ${player.id} trouvé pour membre ${newMember.displayName}`,"debug");

                            let servers = client.db_gameservers.filterArray(rec => rec.gamename == game.id);

                            for (const server of servers) {
                                client.gameServerPlayerBan(player, server);
                            }
                        }
                    }
                }
            })
        }


    }
}

module.exports = guildMemberUpdateListener;