const Discord = require("discord.js");
const moment = require("moment");
const textes = require('./textes');
// This class is used to store languages strings

module.exports = class {
    constructor() {
        this.textes = {

            COM_ACTION_ANNULLE: "Action annulée",
            COM_MEMBER_ACCEPTED: (member) => {
                return `${member.displayName} à rejoint Casual Effect !`;
            },

            MESSAGES_SERVER_JOIN: (member) => {
                let textes = [
                    `Z'ai cru voir passer un ro**${member.displayName}**minet !`,
                    `Ah ! **${member.displayName}** nous a enfin rejoint ! Nous n'attendions plus que lui...`,
                    `Tel qu'annoncé par la prophétie, **${member.displayName}** est apparu !`,
                    `Oh my Bot ! **${member.displayName}** à rejoint le discord !`,
                    `**${member.displayName}** est le 999.999ème visiteur de ce Discord ! Dommage, il aurait pu gagner un pin's...`,
                    `**${member.displayName}** nous arrive tout droit... du néant !?!?`,
                    `Et bah voilà, c'est malin, maintenant y'a **${member.displayName}** qui nous a rejoint`,
                    `Chut, chut, chut ! Arrêtez vos conneries **${member.displayName}** vient de rejoindre le discord`,
                    `AAAAaah ! J'ai eu peur ! Mais non c'est juste **${member.displayName}** qui à rejoint le discord... on a eu chaud !`,
                    `Le petit **${member.displayName}** à été retrouvé seul dans le salon 'accueil' merci de venir le chercher`,
                    `Bon alors pour ton premier jour **${member.displayName}** ce sera corvée de chiottes !`,
                    `**${member.displayName}** vient d'arrriver. Ne bougez surtout pas! Sa vision est basée sur le mouvement...`,
                    `Et puis t'as des mecs comme **${member.displayName}** qui débarquent, comme ça, sans prévenir...`,
                    `Attention **${member.displayName}** vient d'arriver sur le discord. Je suis prêt à parier qu'il aime tuer des gens`,
                    `Quelqu'un à laissé la porte ouverte et **${member.displayName}**est rentré !`
                ]
                return textes.random();
            },
            MESSAGES_SERVER_QUIT: (member) => {
                let textes = [
                    `Adieu **${member.displayName}** tu vas nous manquer... ou pas !`,
                    `RIP **${member.displayName}** petit Ange parti trop tôt`,
                    `Ah Enfin ! On est débarrassé de **${member.displayName}**`,
                    `Ah bah voilà ! Vous avez fait peur à **${member.displayName}** et il est parti !`,
                    `T'as raison **${member.displayName}** ! Casse-toi ! Et qu'on ne te revoit plus jamais par ici`,
                    `T'as les vrai, et puis t'as les mecs comme **${member.displayName}** qui se barrent sans rien dire.`
                ]
                return textes.random();
            },
            MESSAGES_NEW_MEMBER: (member) => {
                let textes = [
                    `${member.displayName} a passé son épreuve d'initiation avec succès et fait désormais partie de Casual Effect`,
                    `${member.displayName} a été intronisé (ça ne fait pas mal) et fait désormais partie de Casual Effect`
                ]
                return textes.random();
            },
            WELCOME: (name) => {
                let textes = [
                    `Z'ai cru voir passer un ro${name}minet !`,
                    `Ah ! ${name} nous a enfin rejoint ! Nous n'attendions plus que lui...`
                ]
                return textes.random();

            },
            MESSAGES_AUREVOIR: [],

            USER_MESSAGE_ACCUEIL_TITRE: "Bienvenue sur Casual Effect",
            USER_MESSAGE_ACCUEIL_DESCRIPTION: (member) => {
                return `Bonjour ${member.displayName},
                
                Je me présente, Alfred, je suis le majordome de Casual Effect.
                Je m'occupe du bon fonctionnement de ce serveur discord et j'apporte quelques services pour améliorer votre séjour parmis nous.

                Pour en savoir plus sur ce que je peux faire pour vous, envoyez moi la commande \`!aide\`, ici par message privé et je vous donnerais la liste des commandes que je peux comprendre.
                
                Je vous souhaite de bien vous amuser sur Casual Effect !`;
            },

            MEMBER_MESSAGE_ACCUEIL_TITRE: "Bienvenue sur Casual Effect",
            MEMBER_MESSAGE_ACCUEIL_DESCRIPTION: (member) => {
                return `Bonjour ${member.displayName},
                
                Je me présente, Alfred, je suis le majordome de Casual Effect.
                Je m'occupe du bon fonctionnement de ce serveur discord et j'apporte quelques services pour améliorer votre séjour parmis nous.

                Pour en savoir plus sur ce que je peux faire pour vous, envoyez moi la commande \`!aide\`, ici par message privé et je vous donnerais la liste des commandes que je peux comprendre.
                
                Je vous souhaite de bien vous amuser sur Casual Effect !`;
            },

            // EXPERIENCE
            EXP_MESSAGE_INFORMATIONS_TITRE: "Expérience et niveau sur Casual Effect",
            EXP_MESSAGE_INFORMATIONS_DESCRIPTION: (member) => {
                return `Bonjour ${member.displayName},
                
                En tant que membre de Casual Effect, votre participation sur le discord vous rapporte de l'expérience qui vous permet de progresser en niveau.
                Vous débutez au niveau 1 et vous progresserez de niveau en niveau grâce au points d'expérience gagnés.

                Vous gagnez de l'expérience lorsque vous:
                - êtes connecté dans un salon vocal
                - jouez à un jeu du serveur
                - postez des messages
                - réagissez ou recevez des réactions à vos messages

                Je vous souhaite de bien vous amuser sur Casual Effect !`;
            },
            EXP_MESSAGE_LEVELUP_TITRE: "Niveau supérieur !",
            EXP_MESSAGE_LEVELUP_DESCRIPTION: (member, level) => {
                return `Félicitations ${member.displayName}, vous avez atteint le niveau ${level}`;
            },
            EXP_MESSAGE_LEVELUP_COMMENTAIRE: (member, level) => {
                let msg = {
                    2: [
                        `Bravo ! c'est un bon début !`,
                        `C'était facile, hein ?`,
                        `Et c'est parti mon kiki !`,
                        `Vers l'infini et plus encore ! Hein, quoi ?`
                    ]
                }

                return `${member.displayName} à rejoint Casual Effect !`;
            },
            EXP_LOG_ADDXP:  (member, xp, reason) => {
                return `${member.displayName} à gagné ${xp}xp (${reason})`;
            },
            EXP_LOG_LEVELUP:  (member, level) => {
                return `Niveau supérieur pour ${member.displayName} qui est désormais level ${level}`;
            },
            // GAMES

            GAMES_LIST_UPDATED: "Liste des jeux mise à jour",
            GAMES_LIST_SUCCESS_CREATED: "Liste des jeux créée",
            GAMES_LIST_SUCCESS_UPDATED: "Liste des jeux mise à jour",
            GAMES_LIST_SUCCESS_DELETED: "Liste des jeux supprimée",
            GAME_LIST_SUCCESS_LOADED: "Liste des jeux chargée",
            GAMES_LIST_WARN_NOTFOUND: "Liste des jeux non trouvée",
            GAMES_LIST_WARN_NOTFOUND_DELETION: "Liste des jeux non trouvée (suppression)",
            GAMES_ACTIVE_NOTIFICATION: (game, member, gameRole, joinChannel) => {
                return `Bonjour ${member.displayName},
                
                Je vois que vous jouez à ${game.name}.
                Saviez-vous qu'il y a un espace dédié à ${game.name} sur Casual Effect ?
                Je vous invite à vous rendre dans le salon ${joinChannel.toString()} et rejoignez les ${gameRole.members.size} joueurs qui y jouent.`;
            },
            GAMES_JOIN_SUCCESS: (jeu) => {
                let textes = [
                    `Félicitations ! Vous avez rejoint le groupe ${jeu}`,
                    `Vous faites désormais partie du groupe ${jeu}`,
                    `Amusez vous bien avec ${jeu}`
                ]
                return textes.random();
            },
            GAMES_JOIN_NOTIFICATION: (game, member) => {
                let textes = [
                    `${member.displayName} à rejoint le groupe ${game.name}`,
                    `${member.displayName} vient complèter les rangs du groupe ${game.name}`
                ]
                return textes.random();
            },
            GAMES_QUIT_NOTIFICATION: (game, member) => {
                let textes = [
                    `${member.displayName} à quitté le groupe ${game.name}`,
                    `${member.displayName} vient de quitter le groupe ${game.name}`
                ]
                return textes.random();
            },
            GAMES_QUIT_SUCCESS: (jeu) => {
                let textes = [
                    `Vous avez quitté le groupe ${jeu}. Vous allez nous manquer!`,
                    `Vous ne faites désormais plus partie du groupe ${jeu}. J'espère vous revoir bientôt !`
                ]
                return textes.random();
            },
            GAMES_QUIT_CANCEL: (jeu) => {
                return `J'attendais une confirmation de votre part.\nAction annulée, il va falloir recommencer.`;
            },
            GAMES_JOIN_ALREADY_IN: (jeu) => {
                return `Vous êtes déjà dans le groupe ${jeu}.`;
            },
            GAMES_JOIN_WANT_TO_QUIT: (jeu) => {
                return `Vous êtes déjà dans le groupe ${jeu}.\n\n**Souhaitez vous le quitter ?** (oui/non)`;
            },


            DEBUG_EVENT_GUILD_MEMBER_UPDATE: (member) => {
                return `guildMemberUpdate (${member.displayName})`;
            },
            LOG_EVENT_USER_ADD_ROLE: (member, role) => {
                return `${member.displayName} ajout du rôle "${role.name}"`;
            },
            LOG_EVENT_USER_REMOVE_ROLE: (member, role) => {
                return `${member.displayName} retrait du rôle "${role.name}"`;
            },


            LOG_EVENT_REACTION_ADD: (messageReaction, member) => {
                return `${member.displayName} à réagi avec ${messageReaction.emoji.name}  sur le message ${messageReaction.message.id}(${messageReaction.message.author.username}) dans ${messageReaction.message.channel.name}`;
            },
            LOG_EVENT_REACTION_REMOVE: (messageReaction, member) => {
                return `${member.displayName} à retiré sa réaction ${messageReaction.emoji.name}  sur le message ${messageReaction.message.id}(${messageReaction.message.author.username}) dans ${messageReaction.message.channel.name}`;
            },
            LOG_EVENT_USER_JOIN_SERVER: (member) => {
                return `${member.displayName} à rejoint le serveur`;
            },
            LOG_EVENT_USER_QUIT_SERVER: (member) => {
                return `${member.displayName} à quitté le serveur`;
            },
            LOG_EVENT_MEMBER_JOIN_MEMBERS: (member) => {
                return `${member.displayName} à rejoint Casual Effect`;
            },
            LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION: "Notification nouveau membre désactivée",
            LOG_EVENT_USERGAME_CREATED: (member, game) => {
                return `Création des données de jeu pour ${member.displayName} sur ${game.name}`;
            },
            MOD_NOTIF_SERVER_JOIN: (member) => {
                return `${member.displayName} à rejoint le serveur`;
            },
            MOD_NOTIF_SERVER_QUIT: (member) => {
                return `${member.displayName} à quitté le serveur`;
            },
            MOD_NOTIF_NEW_MEMBER: (member) => {
                return `${member.displayName} à été accepté et ajouté au groupe des membres`;
            }
        }
    }

    /**
     * The method to get language strings
     * @param {string} term The string or function to look up
     * @param {...*} args Any arguments to pass to the lookup
     * @returns {string|Function}
     */
    get(term, ...args) {
        //if (!this.enabled && this !== this.store.default) return this.store.default.get(term, ...args);
        const value = this.textes[term];
        /* eslint-disable new-cap */
        switch (typeof value) {
            case "function":
                return value(...args);
            case "object":
                return value.random();
            default:
                return value;
        }
    }

    getLang() {
        return lang;
    }

    printDate(pdate, isLongDate) {
        let monthNames = [
            "janvier", "février", "mars",
            "avril", "mai", "juin", "juillet",
            "août", "septembre", "octobre",
            "novembre", "décembre"
        ];

        let day = pdate.getDate();
        let monthIndex = pdate.getMonth();
        let year = pdate.getFullYear();
        let hour = pdate.getHours() < 10 ? "0" + pdate.getHours() : pdate.getHours();
        let minute = pdate.getMinutes() < 10 ? "0" + pdate.getMinutes() : pdate.getMinutes();

        let thedate = (isLongDate) ? day + " " + monthNames[monthIndex] + " " + year + " à " + hour + "h" + minute :
            day + " " + monthNames[monthIndex] + " " + year;
        return thedate;
    }

    /**
     * Parse ms and returns a string
     * @param {number} milliseconds The amount of milliseconds
     * @returns The parsed milliseconds
     */
    convertMs(milliseconds) {
        let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
        let days = roundTowardsZero(milliseconds / 86400000),
            hours = roundTowardsZero(milliseconds / 3600000) % 24,
            minutes = roundTowardsZero(milliseconds / 60000) % 60,
            seconds = roundTowardsZero(milliseconds / 1000) % 60;
        if (seconds === 0) {
            seconds++;
        }
        let isDays = days > 0,
            isHours = hours > 0,
            isMinutes = minutes > 0;
        let pattern =
            (!isDays ? "" : (isMinutes || isHours) ? "{days} jours, " : "{days} jours et ") +
            (!isHours ? "" : (isMinutes) ? "{hours} heures, " : "{hours} heures et ") +
            (!isMinutes ? "" : "{minutes} minutes et ") +
            ("{seconds} secondes");
        let sentence = pattern
            .replace("{duration}", pattern)
            .replace("{days}", days)
            .replace("{hours}", hours)
            .replace("{minutes}", minutes)
            .replace("{seconds}", seconds);
        return sentence;
    }

}