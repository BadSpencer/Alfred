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

        if (newMember.bot) return;

        // Log membre qui change de statut
        if (oldMember.presence.status !== newMember.presence.status) {
            client.log(client.textes.get("COM_USER_NEW_STATUS", newMember, statusTexts[newMember.presence.status]), "debug")
        }

        // Ajout du jeu dans la base s'il n'ets pas trouvé
        if (newMember.presence.game) {
            let gamePlayed = client.db_games.get(newMember.presence.game.name);
            if (!gamePlayed) {
                await client.db.gamesCreate(this.client, newMember.presence.game.name);
                client.core.modLog(client, client.textes.get("MOD_NOTIF_NEW_GAME_ADDED", newMember));
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
                    }
                }
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