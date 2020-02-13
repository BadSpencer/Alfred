const {
    Command
} = require('discord-akairo');

class TirageCommand extends Command {
    constructor() {
        super('tirage', {
            aliases: ['tirage','random', 'rand', 'rnd', 'dés'],
            // define arg properties
            args: [{
                id: 'numFaces',
                type: 'number',
                prompt: {
                    start: 'Combien de faces possède votre dé virtuel ?',
                    retry: 'Hmmm, je m\'attendais à un nombre...'
                }
            }, {
                id: 'numTirages',
                type: 'number',
                prompt: {
                    start: 'Combien de tirages souhaitez vous faire ?',
                    retry: 'Hmmm, je m\'attendais à un nombre...'
                }
            }, ],
            // command description
            description: 'Lance un dé virtuel.',
        });
    }

    exec(message, args) {
        if (args.numFaces == null) message.reply("Utilisation: !tirage <nb faces du dé> <nombre de tirages>");
        if (isNaN(args.numFaces) || (args.numTirages != null && isNaN(args.numTirages))) {message.reply("Il me faut des nombres pour que ça marche bien"); return;}
        if (args.numTirages == null) args.numTirages=1; 
        var msg = "Résultat du tirage: ";
        for (var i=0; i<args.numTirages-1; i++) {
          msg += (Math.floor(Math.random()*args.numFaces)+1).toString() + ", ";
        }
        msg += (Math.floor(Math.random()*args.numFaces)+1).toString();
        message.reply(msg);

    }
}


module.exports = TirageCommand;