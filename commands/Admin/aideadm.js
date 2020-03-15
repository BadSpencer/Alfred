const colors = require('../../utils/colors');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../../utils/messages');
const {
    Message,
    RichEmbed,
    Permissions
} = require('discord.js');
const {
    Command,
    PrefixSupplier
} = require('discord-akairo');

class AideAdmCommand extends Command {
    constructor() {
        super('aideadm', {
            aliases: ['aideadm'],
            category: 'Admin',
            userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
            args: [{
                id: 'command',
                type: 'commandAlias',
                prompt: {
                    start: 'Pour quelle commande souhaitez-vous de l\'aide ?',
                    retry: 'Veuilelz saisir une commande qui existe !',
                    optional: true
                },
                match: 'rest'
            }],
            description: {
                content: 'Affiche l\'aide',
                usage: '[commande]',
                examples: ['', 'play', 'sugg']
            }
        });
    }

    exec(message, { command }) {
        if (!command) {
            const embed = new RichEmbed()
                .setColor(3447003)
                .addField('❯ Commandes', `Liste des commandes disponibles.
                Pour plus d'informations sur une commande, lancez \`!aide <commande>\`
            `);

            for (const category of this.handler.categories.values()) {

                let commands = category.filter(cmd => cmd.userPermissions == undefined)
                if (commands.size == 0) continue;

                embed.addField(
                    `❯ ${category.id.replace(/(\b\w)/gi, lc => lc.toUpperCase())}`,
                    `${category
                        .filter(cmd => cmd.aliases.length > 0)
                        .map(cmd => `\`${cmd.aliases[0]}\``)
                        .join('\n')}`,
                    true);
            }

            return message.util.send(embed);
        }

        const embed = new RichEmbed()
            .setColor(3447003)
            .setTitle(`\`${command.aliases[0]} ${command.description.usage || ''}\``)
            .addField('❯ Description', command.description.content || '\u200b');

        if (command.aliases.length > 1) embed.addField('❯ Aliases', `\`${command.aliases.join('` `')}\``, true);
        if (command.description.examples.length)
            embed.addField(
                '❯ Examples',
                `\`${command.aliases[0]} ${command.description.examples.join(`\`\n\`${command.aliases[0]} `)}\``,
                true,
            );

        return message.util.send(embed);
    }

}

module.exports = AideAdmCommand;