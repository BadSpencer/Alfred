const Discord = require("discord.js");
const { Command } = require('discord-akairo');
const colors = require('../../../utils/colors');
const textes = new (require(`../../../utils/textes.js`));

class ServersCommand extends Command {
    constructor() {
        super('server', {
            aliases: ['server', 's'],
            category: 'Modération-server',
            description: {
                content: textes.get('GAMESERVER_SERVER_DESCRIPTION_CONTENT'),
                usage: textes.get('GAMESERVER_SERVER_DESCRIPTION_USAGE'),
                examples: ['']
            }
        });
    }
    async exec(message, args) {
        let client = this.client;
        let description = textes.get('GAMESERVER_SERVER_HELP_DESCRIPTION');

        let command = this.id;
        let commands = this.handler.categories.find(category => category.id == this.categoryID);

        commands.forEach(function (cmd) {
            if (cmd.id !== command)  {
                description += `**${cmd.id}**\n${cmd.description.content}\n`;
            };
        });

        const embed = new Discord.MessageEmbed();
        embed.setColor(colors.darkgreen);
        embed.setTitle(`Informations et aide sur les serveurs`);
        embed.setDescription(description)

        if (message.channel.type === 'text') message.delete();
        return message.channel.send(embed);
    }

}
module.exports = ServersCommand;