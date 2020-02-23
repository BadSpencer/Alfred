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
            COM_MEMBER_ADD_ROLE:  (member, role) => {
                return `${member.displayName} ajout du rôle "${role.name}"`;
            },
            COM_MEMBER_REMOVE_ROLE:  (member, role) => {
                return `${member.displayName} retrait du rôle "${role.name}"`;
            },
            MESSAGES_BIENVENUE: [
                "Z'ai cru voir passer un ro{{user}}minet !",
                "Ah ! {{user}} nous a enfin rejoint ! Nous n'attendions plus que lui...",
                "Tel qu'annoncé par la prophétie, {{user}} est apparu !",
                "Oh my Bot ! {{user}} à rejoint le discord !",
                "{{user}} est le 999.999ème visiteur de ce Discord ! Dommage, il aurait pu gagner un pin's...",
                "{{user}} nous arrive tout droit... du néant !?!?",
                "Et bah voilà, c'est malin, maintenant y'a {{user}} qui nous a rejoint",
                "Chut, chut, chut ! Arrêtez vos conneries {{user}} vient de rejoindre le discord",
                "AAAAaah ! J'ai eu peur ! Mais non c'est juste {{user}} qui à rejoint le discord... on a eu chaud !",
                "Le petit {{user}} à été retrouvé seul dans le salon 'accueil' merci de venir le chercher",
                "Bon alors pour ton premier jour {{user}} ce sera corvée de chiottes !",
                "{{user}} vient d'arrriver. Ne bougez surtout pas! Sa vision est basée sur le mouvement...",
                "Et puis t'as des mecs comme {{user}} qui débarquent, comme ça, sans prévenir...",
                "Attention {{user}} vient d'arriver sur le discord. Je suis prêt à parier qu'il aime tuer des gens",
                "Quelqu'un à laissé la porte ouverte et {{user}} est rentré !"
            ],
            WELCOME: (name) => {
                let textes = [
                    `Z'ai cru voir passer un ro${name}minet !`,
                    `Ah ! ${name} nous a enfin rejoint ! Nous n'attendions plus que lui...`
                ]
                return textes.random();

            },
            MESSAGES_AUREVOIR: [],

            GAMES_LIST_UPDATED: "Liste des jeux mise à jour",
            GAMES_LIST_SUCCESS_CREATED: "Liste des jeux créée",
            GAMES_LIST_SUCCESS_UPDATED: "Liste des jeux mise à jour",
            GAMES_LIST_SUCCESS_DELETED: "Liste des jeux supprimée",
            GAMES_LIST_SUCCESS_LOADED: "Liste des jeux chargée",
            GAMES_LIST_WARN_NOTFOUND: "Liste des jeux non trouvée",
            GAMES_LIST_WARN_NOTFOUND_DELETION: "Liste des jeux non trouvée (suppression)",
            GAMES_JOIN_SUCCESS: (jeu) => {
                let textes = [
                    `Félicitations ! Vous avez rejoint le groupe ${jeu}`,
                    `Vous faites désormais partie du groupe ${jeu}`,
                    `Amusez vous bien avec ${jeu}`
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
            GAMES_JOIN_ALREADY_IN: (jeu) => {
                return `Vous êtes déjà dans le groupe ${jeu}.`;
            },
            GAMES_JOIN_WANT_TO_QUIT: (jeu) => {
                return `Souhaitez vous quitter le groupe du jeu ${jeu} ? (oui/non)`;
            },
            LOG_EVENT_REACTION_ADD: (messageReaction, member) => {
                return `${member.displayName} à réagi avec ${messageReaction.emoji.name}  sur le message ${messageReaction.message.id}(${messageReaction.message.author.username}) dans ${messageReaction.message.channel.name}`;
            },
            LOG_EVENT_REACTION_REMOVE: (messageReaction, member) => {
                return `${member.displayName} à retiré sa réaction ${messageReaction.emoji.name}  sur le message ${messageReaction.message.id}(${messageReaction.message.author.username}) dans ${messageReaction.message.channel.name}`;
            },
            LOG_EVENT_MEMBER_JOIN_SERVER: (member) => {
                return `${member.displayName} à rejoint le serveur`;
            },
            LOG_EVENT_MEMBER_JOIN_MEMBERS: (member) => {
                return `${member.displayName} à rejoint Casual Effect`;
            },
            LOG_EVENT_MEMBER_JOIN_NO_NOTIFICATION: "Notification nouveau membre désactivée",


            // Utils
            PREFIX_INFO: (prefix) => `le préfixe de ce serveur est \`${prefix}\``,
            /* DBL VOTES */
            VOTE_THANKS: (user) => `:arrow_up: Bonjour ${user.toString()}, merci de voter !\nVotre récompense : 40 crédits !`,
            VOTE_LOGS: (user) => `:arrow_up: **${user.tag}** (\`${user.id}\`) a voté pour **Atlanta** et a gagné **40** crédits, merci !\nhttps://discordbots.org/bot/557445719892688897/vote`,

            ENABLE_MESSAGES: "Activer les messages"
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