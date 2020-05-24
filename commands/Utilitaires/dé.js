const {
    Command
} = require('discord-akairo');

class DéCommand extends Command {
    constructor() {
        super('dé', {
            aliases: ['dé','random', 'rand', 'rnd'],
            category: 'Utilitaires',
            // define arg properties
            args: [{
                id: 'numFaces',
                type: 'number',
                prompt: {
                    start: 'Combien de faces possède votre dé virtuel ?',
                    retry: 'Hmmm, je m\'attendais à un nombre...',
                    default: 6
                }
            }, {
                id: 'numTirages',
                type: 'number',
                prompt: {
                    start: 'Combien de tirages souhaitez vous faire ?',
                    retry: 'Hmmm, je m\'attendais à un nombre...',
                    default: 1
                }
            }, ],
            // command description

            description: {
                content: 'Permet d\'effectuer un lancer de dé virtuel',
                usage: `\`!dé [<nb faces> <nb tirages>]\`
                Choisissez le nombre de faces que comporte votre dé et le nombre de tirages successifs que vous souhaitez que j\'effectue.
                Si vous lancez la commande sans paramètre, j'effectuerais un seul lancé d'un dé à six faces`,
                examples: ['!dé','!dé 20 4', '!rnd 100 1']
            }
        });
    }

    exec(message, args) {
        if (args.numFaces == null) message.reply("Utilisation: !tirage <nb faces du dé> <nombre de tirages>");
        if (isNaN(args.numFaces) || (args.numTirages != null && isNaN(args.numTirages))) {message.reply("Il me faut des nombres pour que ça marche bien"); return;}
        if (args.numTirages == null) args.numTirages=1; 
        var msg = "Résultat du tirage: ";
        for (var i=0; i<args.numTirages-1; i++) {
          msg += `${(Math.floor(Math.random()*args.numFaces)+1).toString()},`;
        }
        msg += `${(Math.floor(Math.random()*args.numFaces)+1).toString()},`;
        message.reply(msg);
        if (message.channel.type === 'text') message.delete();;

    }
}


module.exports = DéCommand;