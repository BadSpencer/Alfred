const Discord = require("discord.js");
const colors = require('../../utils/colors');
const { successMessage, errorMessage, warnMessage, questionMessage, promptMessage } = require('../../utils/messages');
const {
    Message,
    MessageEmbed,
    Permissions
} = require('discord.js');
const {
    Command,
    PrefixSupplier
} = require("discord-akairo");
const textes = new (require(`../../utils/textes.js`));

class AideCommand extends Command {
    constructor() {
        super('aide', {
            aliases: ['aide', 'help', 'h'],
            category: 'Utilitaires',
            description: {
                content: textes.get('AIDE_AIDE_DESCRIPTION_CONTENT'),
                usage: textes.get('AIDE_AIDE_DESCRIPTION_USAGE'),
                examples: ['!aide', '!help ping', '!h']
            }
        });
    }

    async *args(message) {
        let client = this.client;
        const command = yield {
            type: 'commandAlias',
            match: 'rest',
            prompt: {
                start: message => promptMessage(textes.get('CMD_CMDALIAS_PROMPT')),
                retry: message => promptMessage(textes.get('CMD_CMDALIAS_RETRY')),
                optional: true
            }
        };
        return { command };
    };


    async exec(message, args) {
        let client = this.client;
        const guild = client.guilds.cache.get(client.config.guildID);

        let member = guild.members.cache.get(message.author.id);

        //const roleEve = guild.roles.cache.find(r => { return r.name == "@everyone" });
        //const roleMem = guild.roles.cache.find(r => { return r.name == message.settings.memberRole });
        const roleMod = guild.roles.cache.find(r => { return r.name == message.settings.modRole });
        const roleAdm = guild.roles.cache.find(r => { return r.name == message.settings.adminRole });

        let ignoredCategories = [];
        ignoredCategories.push('Auto');
        if (!member.roles.cache.has(roleMod.id) && !member.roles.cache.has(roleAdm.id)) {
            ignoredCategories.push('Admin');
            ignoredCategories.push('Modération');
            ignoredCategories.push('Jeux');
            ignoredCategories.push('Serveurs');
            ignoredCategories.push('Joueurs');
        }

        if (!args.command) {
            let postedEmbeds = client.db_postedEmbeds.get("default");
            let embeds = [];
            let pagesArray = [];

            const nbFixedPages = 1;

            let postDescriptionAccueil = "";

            let totalPages = nbFixedPages; // Nombre de pages fixes avant les pages de catégories de commandes
            this.handler.categories.forEach((cm, category) => {
                if (!ignoredCategories.includes(category)) {
                    totalPages += 1;
                    postDescriptionAccueil += `**${totalPages}**: ${category}\n`
                }
            });

            embeds.push(new MessageEmbed(await client.aideGetAideEmbedPage(1, totalPages, null, postDescriptionAccueil)));


            let pageIndex = nbFixedPages; // Nombre de pages fixes avant les pages de catégories de commandes
            this.handler.categories.forEach((cm, category) => {
                if (!ignoredCategories.includes(category)) {

                    let cat = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

                    const embed = new MessageEmbed();
                    let description = "";
                    pageIndex += 1;

                    const commands = cm.filter(cmd => cmd.category === cm && cmd.description.content !== undefined);

                    if (commands.size > 0) {

                        commands.forEach(function (cmd) {
                            description += `**${cmd}** ${cmd.description.content}\n`;
                        });
                        embed.setTitle(`${category}`);
                        embed.setColor(colors['darkgreen']);
                        embed.setDescription(description);
                        embed.setFooter(`Page: ${pageIndex}/${totalPages}`);
                        embeds.push(embed);
                    }
                }
            });

            let pageCount = 0;
            embeds.forEach(embed => {
                pageCount += 1;
                let firstRow = 0;
                let lastRow = 0;

                let pagesRecord = {
                    "page": pageCount,
                    "firstRow": firstRow,
                    "lastRow": lastRow,
                    "embed": embed
                };
                pagesArray.push(pagesRecord);
            });

            if (message.channel.type === 'text') message.delete();

            return message.author.send(embeds[0]).then(async msgSent => {
                postedEmbeds.id = msgSent.id;
                postedEmbeds.channelID = msgSent.channel.id;
                postedEmbeds.name = `Aide`;
                postedEmbeds.currentPage = 1;
                postedEmbeds.totalPages = pagesArray.length;
                postedEmbeds.pages = pagesArray;
                client.db_postedEmbeds.set(postedEmbeds.id, postedEmbeds);
                await msgSent.react(`◀️`);
                await msgSent.react(`▶️`);
            });

        }

        const embed = new MessageEmbed();
        let description = "";
        embed.setColor(colors.darkgreen);
        embed.setTitle(`Aide sur la commande: **${args.command.aliases[0]}**`);
        embed.setDescription(description)
        embed.addField('Description', args.command.description.content || '\u200b');
        embed.addField('Utilisation', args.command.description.usage || '\u200b');

        if (args.command.aliases.length > 1) embed.addField('Alias', `\n\`${args.command.aliases.join('` `')}\``, true);
        if (args.command.description.examples.length)
            embed.addField(
                'Exemples',
                `\`${args.command.description.examples.join(`\`\n\``)}\``,
                false,
            );

        if (message.channel.type === 'text') message.delete();
        return message.util.send(embed);
    }

}

module.exports = AideCommand;