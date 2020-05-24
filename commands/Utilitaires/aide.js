const Discord = require("discord.js");
const colors = require('../../utils/colors');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('../../utils/messages');
const {
    Message,
    MessageEmbed,
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
            args: [{
                id: 'command',
                type: 'commandAlias',
                prompt: {
                    start: 'Pour quelle commande souhaitez vous de l\'aide ?',
                    retry: 'Veuillez spécifier une commande valide.',
                    optional: true
                },
                match: 'rest'
            }],
            description: {
                content: 'Affiche ce message d\'aide et une aide détaillée pour chaque commande',
                usage: `\`!aide [commande ou alias]\` Les crochets \`[...]\` signifient que le paramètre est optionnel
                Lancée sans paramètre, j\'afficherai ce menu d\'aide
                Si vous spécifiez une commande ou bien un de ses alias, alors je vous afficherais une aide plus détaillée sur cette commande`,
                examples: ['!aide', '!help tirage','!h sug']
            }
        });
    }

    async exec(message, { command }) {
        let client = this.client;
        const guild = client.guilds.cache.get(client.config.guildID);

        let member = guild.members.cache.get(message.author.id);

        //const roleEve = guild.roles.cache.find(r => { return r.name == "@everyone" });
        //const roleMem = guild.roles.cache.find(r => { return r.name == message.settings.memberRole });
        const roleMod = guild.roles.cache.find(r => { return r.name == message.settings.modRole });
        const roleAdm = guild.roles.cache.find(r => { return r.name == message.settings.adminRole });

        let ignoredCategories = [];
        ignoredCategories.push("Auto");
        // if (!member.roles.cache.has(roleMod.id) && !member.roles.cache.has(roleAdm.id)) {
            ignoredCategories.push("Admin");
            ignoredCategories.push("Modération");
        // }




        if (!command) {
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
                    const embed = new MessageEmbed();
                    let description = "";
                    pageIndex += 1;

                    const commands = cm.filter(cmd => cmd.category === cm && cmd.description.content !== undefined);

                    if (commands.size > 0) {

                        commands.forEach(function (cmd) {
                            // embed.addField(`**\`!${cmd}\`**`, cmd.description.content, true);
                            description += `**!${cmd}**\n${cmd.description.content}\n\n`;
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
        embed.setTitle(`Aide sur la commande: **${command.aliases[0]}**`);
        embed.setDescription(description)
        embed.addField('Description', command.description.content || '\u200b');
        embed.addField('Utilisation', command.description.usage || '\u200b');

        if (command.aliases.length > 1) embed.addField('Aliases', `\n\`${command.aliases.join('` `')}\``, true);
        if (command.description.examples.length)
            embed.addField(
                'Exemples',
                `\`${command.description.examples.join(`\`\n\``)}\``,
                false,
            );

        if (message.channel.type === 'text') message.delete();
        return message.util.send(embed);
    }

}

module.exports = AideCommand;