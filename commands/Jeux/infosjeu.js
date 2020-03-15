const {
    Command
} = require('discord-akairo');
const Discord = require("discord.js");

class InfosJeuCommand extends Command {
    constructor() {
        super('infojeu', {
            category: 'Jeux',
        });
    }
    condition(message) {
        let client = this.client;
        const gameJoinChannel = message.guild.channels.find(c => c.name === message.settings.gameJoinChannel);

        if (message.channel.id == gameJoinChannel.id) {
            if (message.mentions.roles.first()) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }


    exec(message) {
        let client = this.client;
        let role = message.mentions.roles.first();
        const game = client.db_games.find(game => game.roleID == role.id);

        if (game) {

            let description = client.textes.get("GAMES_INFOSJEU_DESCRIPTION", game, role)
            const embed = new Discord.RichEmbed();
            embed.setTitle(game.name);
            embed.setDescription(description);

            if (role.members.size > 0) {
                if (role.members.size == 1) {
                    embed.addField(`**${role.members.size}** joueur`, role.members.map(m => m.displayName).join(` `), true);
                } else {
                    embed.addField(`**${role.members.size}** joueurs`, role.members.map(m => m.displayName).join(`, `), true);
                }
            }

            message.util.send(embed).then(msgSent => {
                msgSent.delete(60000);
            });

        }

    }
}

module.exports = InfosJeuCommand;