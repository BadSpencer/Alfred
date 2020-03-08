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
            aliases: ['help', 'halp', 'h'],
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
                content: 'Displays a list of commands or information about a command.',
                usage: '[command]',
                examples: ['', 'say', 'tag']
            }
        });
    }

    exec(message, {
        command
    }) {
        if (!command) return this.execCommandList(message);

        const description = Object.assign({
            content: 'No description available.',
            usage: '',
            examples: [],
            fields: []
        }, command.description);

        const embed = this.client.util.embed()
            .setColor(colors['darkorange'])
            .setTitle(`\`${this.client.commandHandler.prefix[0]}${command.aliases[0]} ${description.usage}\``)
            .addField('Description', description.content)
            .setFooter(`All the available prefix: ${this.client.commandHandler.prefix.join(' | ')}`);

        for (const field of description.fields) embed.addField(field.name, field.value);

        if (description.examples.length) {
            const text = `${this.client.commandHandler.prefix[0]}${command.aliases[0]}`;
            embed.addField('Examples', `\`${text} ${description.examples.join(`\`\n\`${text} `)}\``, true);
        }

        if (command.aliases.length > 1) {
            embed.addField('Aliases', `\`${command.aliases.join('` `')}\``, true);
        }

        if (command.userPermissions) {
            embed.addField('User permission', `\`${command.userPermissions.join('` `')}\``, true);
        }

        if (command.clientPermissions) {
            embed.addField('Bot permission', `\`${command.clientPermissions.join('` `')}\``, true);
        }

        return message.util.send({
            embed
        });
    }

    async execCommandList(message) {
        const embed = this.client.util.embed()
            .setColor(colors['darkorange'])
            .addField('Command List',
                [
                    'This is a list of commands.',
                    `To view details for a command, do \`${this.client.commandHandler.prefix[0]}help <command>\`.`
                ])
            .setFooter(`All the available prefix: ${this.client.commandHandler.prefix}`);

        for (const category of this.handler.categories.values()) {
            let title;
            if (message.author.id == this.client.ownerID) {
                title = {
                    Vocales: '🔊\u2000Audio',
                    Utilitaires: '🔩\u2000Utilitaires',
                    Modération: '⚡\u2000Modération',
                    config: '🛠️\u2000Configuration',
                } [category.id];
            } else {
                title = {
                    Vocales: '🔊\u2000Audio',
                    Utilitaires: '🔩\u2000Utilitaires',
                    Modération: '⚡\u2000Modération',
                } [category.id];
            }

            if (title) embed.addField(title, `\`${category.map(cmd => cmd.aliases[0]).join('` `')}\``);
        }

        const shouldReply = message.guild && message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES');

        try {
            await message.author.send({
                embed
            });
            if (shouldReply) return successMessage(client.textes.get("COM_REPLY_MESSAGE_SEND_BY_DM"), message.channel);
        } catch (err) {
            if (shouldReply) return message.util.send({
                embed
            });
        }

        return undefined;
    }
}

module.exports = HelpCommand;