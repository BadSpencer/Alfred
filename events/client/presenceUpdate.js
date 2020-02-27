const {
    Listener
} = require('discord-akairo');

const statusTexts = {
    'online': 'en ligne',
    'offline': 'hors ligne',
    'idle': 'inactif',
    'dnd': 'en mode "Ne pas déranger"',
};


class presenceUpdateListener extends Listener {
    constructor() {
        super('presenceUpdate', {
            emitter: 'client',
            eventName: 'presenceUpdate'
        });
    }

    async exec(oldMember, newMember) {
        let client = this.client;

        // Log membre qui change de statut
        if (oldMember.presence.status !== newMember.presence.status) {
            client.logger.log(`${newMember.displayName} (${newMember.id}) est désormais ${statusTexts[newMember.presence.status]}`);
        }

        // Ajout du jeu dans la base s'il n'ets pas trouvé
        if (newMember.presence.game) {
            let gamePlayed = client.db_games.get(newMember.presence.game.name);
            if (!gamePlayed) {
                await client.db.gamesCreate(this.client, newMember.presence.game.name);
            }
        }

        /*---------------------------------------------------------------------------------------------*/
        /*                       Le membre se met à jouer à quelque chose                              */
        /*---------------------------------------------------------------------------------------------*/
        if (oldMember.presence.game == null && newMember.presence.game !== null) {
            let gamePlayed = client.db_games.get(newMember.presence.game.name);
            if (gamePlayed && gamePlayed.actif) {

                client.games.createUsergame(client, gamePlayed, newMember);

                if (gamePlayed.actif) {
                    let gamePlayRole = newMember.guild.roles.get(gamePlayed.playRoleID);
                    if (newMember.roles.has(gamePlayed.roleID)) {
                        await newMember.addRole(gamePlayRole);
                        client.logger.log(`${newMember.displayName} ajout du rôle "${gamePlayRole.name}"`);
                    }
                }
            }
        }

        /*---------------------------------------------------------------------------------------------*/
        /*                           Membre a arreté de jouer à un jeu                                 */
        /*---------------------------------------------------------------------------------------------*/
        if (oldMember.presence.game !== null && newMember.presence.game == null) {
            let gamePlayed = client.db_games.get(oldMember.presence.game.name);
            if (gamePlayed) {
                if (gamePlayed.actif) {
                    let gamePlayRole = oldMember.guild.roles.get(gamePlayed.playRoleID);
                    if (oldMember.roles.has(gamePlayed.roleID)) {
                        await oldMember.removeRole(gamePlayRole);
                        client.logger.log(`${oldMember.displayName} retrait du rôle "Joue à ${oldMember.presence.game.name}"`, "debug");
                    }
                }
            } else {
                client.logger.log(`Discordtag ${oldMember.presence.game.name} non trouvé`, "debug");
            }

        }


        /*---------------------------------------------------------------------------------------------*/
        /*                                 Membre a changé de jeu                                      */
        /*---------------------------------------------------------------------------------------------*/
        if (oldMember.presence.game !== null && newMember.presence.game !== null) {

            let gamePlayedOld = client.db_games.get(oldMember.presence.game.name);
            if (gamePlayedOld) {
                let gamePlayRole = oldMember.guild.roles.get(gamePlayedOld.playRoleID);
                if (oldMember.roles.has(gamePlayedOld.roleID)) {
                    await oldMember.removeRole(gamePlayRole);
                }
            }

            let gamePlayedNew = client.db_games.get(newMember.presence.game.name);
            if (gamePlayedNew) {
                let gamePlayRole = newMember.guild.roles.get(gamePlayedNew.playRoleID);
                if (newMember.roles.has(gamePlayedNew.roleID)) {
                    await newMember.addRole(gamePlayRole);
                }
            }

        }

    }
}



module.exports = presenceUpdateListener;