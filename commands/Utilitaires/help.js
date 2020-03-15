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

class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help', 'halp', 'aide', 'h'],
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
            const embed = new RichEmbed()
				.setColor(3447003)
				.addField('❯ Commandes', `Liste des commandes disponibles.
                Pour plus d'informations sur une commande, lancez \`!aide <commande>\`
            `);

			for (const category of this.handler.categories.values()) {
				embed.addField(
					`❯ ${category.id.replace(/(\b\w)/gi, lc => lc.toUpperCase())}`,
					`${category
						.filter(cmd => cmd.aliases.length > 0)
						.map(cmd => `\`${cmd.aliases[0]}\``)
						.join(' ')}`,
				);
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

module.exports = HelpCommand;