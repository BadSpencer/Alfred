const colors = require('../../utils/colors');
const {
    errorMessage,
    warnMessage
} = require('../../utils/messages');

// Translations
const { MESSAGES } = require('../../localization/fr');
const channels = require('../../localization/channels');
const permissions = require('../../localization/permissions');

// Required things for using Embeds and extending Akairo Command
const {
    RichEmbed
} = require('discord.js');
const {
    Command
} = require('discord-akairo');

class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help', 'h'],
            // define arg properties
            args: [{
                id: 'key',
                type: 'string',
                match: 'content',
                default: null,
            }, ],
            // command description
            description: MESSAGES.COMMANDS.HELP.DESCRIPTION,
            //description: `Help`,
        });
    }

    _getFullList(msg) {
        const embed = new RichEmbed()
            .setFooter('Alfred v' + process.env.VERSION)
            .setThumbnail(this.client.user.displayAvatarURL)
            .setTimestamp(new Date());

        this.handler.categories.forEach((cmd, cat) => {
            const field = {
                name: cat,
                value: '',
                inline: false,
            };

            cmd.forEach((cmd2) => {
                let cmdName = cmd2.aliases[0];
                field.value += `\`${cmdName}\`\n`
                field.inline = true;
            });

            field.value = `${field.value}`;
            embed.fields.push(field);
        });

        embed.setColor(colors['magenta']);
        return embed;
    };

    _getCmdInfo(msg, cmd) {
        const embed = new RichEmbed()
            .setFooter('Alfred v' + process.env.VERSION)
            .setThumbnail(this.client.user.displayAvatarURL)
            .setTimestamp(new Date());

        embed.title = `Information sur la commande ${cmd.aliases[0]}`;
        embed.description = cmd.description ? cmd.description : 'Il n\'y a pas de description pour cette commande.';

        if (cmd.aliases) {
            embed.addField('Alias', `\`${cmd.aliases.join(', ')}\``, true);
        }

        if (cmd.cooldown && cmd.ratelimit) {
            embed.addField('Cooldown', `${cmd.ratelimit} utilisation(s) toutes les ${duration(cmd.cooldown)}`, true)
        }

        if (cmd.channelRestriction) {
            embed.addField('Restrictions', `\`${channels[cmd.channelRestriction]}\``, true);
        }

        if (cmd.clientPermissions) {
            embed.addField('Permissions', `\`${permissions[cmd.clientPermissions]}\``, true);
        }

        if (cmd.userPermissions) {
            embed.addField('Permissions du membre', `\`${permissions[cmd.userPermissions]}\``, true);
        }

        embed.setColor(colors['mediumpurple']);
        return embed;
    }

    exec(message, args) {
        const filter = (reaction, client) => reaction.emoji.name === '✅' && client.id === this.client.id;

        if (args.key) {
            // Find command or category
            const key = args.key.toLowerCase();

            if (this.handler.modules.has(key)) {
                // Found a command
                const cmd = this.handler.modules.get(key);
                if (message.channel.type === 'text') {
                    message.react('✅');
                    message.awaitReactions(filter, {
                            time: 5000
                        })
                        .catch(() => {
                            errorMessage('Le délai a été dépassé, veuillez réessayer plus tard.', message)
                        });

                    return message.author.send(`Voici des informations sur la commande **\`${key}\`**`, {
                            embed: this._getCmdInfo(message, cmd)
                        })
                        .catch(() => {
                            return errorMessage('Je ne peux pas vous envoyer mes commandes, vérifiez vos options de confidentialité.', message);
                        });

                } else if (message.channel.type === 'dm') {
                    return message.author.send(`Voici des informations sur la commande **\`${key}\`**`, {
                            embed: this._getCmdInfo(message, cmd)
                        })
                        .catch(() => O_o);

                } else {
                    return warnMessage(`Je n'ai pas trouvé de commandes appelées **${key}**`, message);
                }
            }
        }

        // List all categories if none was provided
        if (message.channel.type === 'text') {
            message.react('✅');
            message.awaitReactions(filter, {
                    time: 100
                })
                .catch(() => {
                    return errorMessage('Le délai a été dépassé, veuillez réessayer plus tard.', message)
                });

            return message.author.send('**Voici une liste de toutes les commandes par catégorie:**', {
                    embed: this._getFullList(message)
                })
                .catch(() => {
                    errorMessage('Je ne peux pas vous envoyer mes commandes par message privé, vérifiez vos options de confidentialité.', message).then(m => m.delete(10000));
                });

        } else if (message.channel.type === 'dm') {
            return message.author.send('**Voici une liste de toutes les commandes par catégorie:**', {
                    embed: this._getFullList(message)
                })
                .catch(() => O_o)
        };
    }
}


module.exports = HelpCommand;