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

class AideCommand extends Command {
    constructor() {
        super('aide', {
            aliases: ['aide', 'help', 'h'],
            category: 'Utilitaires',
            clientPermissions: ['EMBED_LINKS'],
            args: [{
                id: 'command',
                type: 'commandAlias',
                prompt: {
                    start: 'Which command do you need help with?',
                    retry: 'Please provide a valid command.',
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

            const embed = new RichEmbed();
            this.handler.categories.forEach((cm, category) => {
                const dirSize = cm.filter(cmd => cmd.category === cm);
                let mappedOut = cm.map(x => `\`${x}\``).join(', ')
                if (category === 'Owner' && !this.client.ownerID.includes(message.author.id)
                    ||
                    category === 'Moderation' && !message.member.permissions.has('MANAGE_MESSAGES')
                ) mappedOut = '`No commands available..`'

                embed.addField(`${dirSize.size} | **${category} Commands**`, mappedOut)
                    .setColor(colors['darkorange'])
                    .setAuthor(`Help Menu | ${message.guild.name}`, message.guild.iconURL)

            });
            /*
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
    */
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

        message.delete();
        return message.util.send(embed);
    }

}

module.exports = AideCommand;