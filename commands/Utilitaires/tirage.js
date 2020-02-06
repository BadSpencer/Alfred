// Some useful things I defined in a utility file (see CommonUtil.js in the next Gist file)
const {
    CommonUtil: fonctions
} = require('../../utils/functions');
const colors = require('../../utils/colors');
//const prettyMs = require('pretty-ms');

// Mine
const {
    errorMessage,
    warnMessage
} = require('../../utils/messages');

// Translations
const channels = require('../../localization/channels');
const permissions = require('../../localization/permissions');

// Required things for using Embeds and extending Akairo Command
const {
    RichEmbed
} = require('discord.js');
const {
    Command
} = require('discord-akairo');

class TirageCommand extends Command {
    constructor() {
        super('tirage', {
            aliases: ['random', 'rand', 'rnd', 'dés'],
            // define arg properties
            args: [{
                id: 'numFaces',
                type: 'number',
                default: 6
            }, {
                id: 'numTirages',
                type: 'number',
                default: 1
            }, ],
            // command description
            description: 'Lancez un dé virtuel.',
        });
    }

    exec(message, args) {

        if (args.numfaces == null) message.reply("Utilisation: !tirage <nb faces du dé> <nombre de tirages>");
        if (isNaN(args.numfaces) || (args.numtirages != null && isNaN(args.numtirages))) {message.reply("Il me faut des nombres pour que ça marche bien"); return;}
        if (args.numtirages == null) args.numtirages=1; 
        var msg = "Résultat du tirage: ";
        for (var i=0; i<number-1; i++) {
          msg += (Math.floor(Math.random()*size)+1).toString() + ", ";
        }
        msg += (Math.floor(Math.random()*size)+1).toString();
        message.reply(msg);

    }
}


module.exports = TirageCommand;