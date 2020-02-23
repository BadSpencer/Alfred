const moment = require("moment");
const Discord = require("discord.js");
const {
    RichEmbed
} = require('discord.js');



exports.removeRoleReaction = async (client) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    const gameJoinChannel = await guild.channels.find(c => c.name === settings.gameJoinChannel);

    if (!gameJoinChannel) return;

    if (settings.gameJoinMessage !== "") {
        gameJoinMessage = await gameJoinChannel.fetchMessage(settings.gameJoinMessage).then(message => {
            message.delete();
            settings.gameJoinMessage == "";
            client.logger.log(client.textes.get("GAMES_LIST_SUCCESS_DELETED"));
        }).catch(err => {
            settings.gameJoinMessage == "";
            client.logger.warn(client.textes.get("GAMES_LIST_WARN_NOTFOUND_DELETION"));
        });
    }

    client.db_settings.set(guild.id, settings);
}
exports.PostRoleReaction = async (client, clearReact = false) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    const games = await client.db.gamesGetActive(client);

    const gameJoinChannel = await guild.channels.find(c => c.name === settings.gameJoinChannel);

    let embed = new Discord.RichEmbed(await client.games.gameGetListEmbed(client));

    let gameJoinMessage = undefined;
    if (settings.gameJoinMessage !== "") {
        await gameJoinChannel.fetchMessage(settings.gameJoinMessage).then(message => {
            gameJoinMessage = message;
            client.logger.log(client.textes.get("GAMES_LIST_SUCCESS_LOADED"));
        }).catch(err => {
            client.logger.warn(client.textes.get("GAMES_LIST_WARN_NOTFOUND"));
        });
    }

    let gamesArray = games.array();
    gamesArray.sort(function (a, b) {
        return a.name > b.name;
    });

    if (!gameJoinMessage) {
        await gameJoinChannel.send(embed).then(async msgSent => {
            settings.gameJoinMessage = msgSent.id;
            client.db_settings.set(guild.id, settings);
            for (const game of gamesArray) {
                await msgSent.react(game.emoji);
            }
        });
        client.logger.log(client.textes.get("GAMES_LIST_SUCCESS_CREATED"))
    } else {
        gameJoinMessage.edit(embed).then(async msgSent => {
            if (clearReact) {
                msgSent.clearReactions();
                for (const game of gamesArray) {
                    await msgSent.react(game.emoji);
                }
            }
        });
        client.logger.log(client.textes.get("GAMES_LIST_SUCCESS_UPDATED"))
    }

};

exports.gameGetListEmbed = async (client) => {
    const Discord = require("discord.js");
    const guild = client.guilds.get(client.config.guildID);
    const games = await client.db.gamesGetActive(client);


    let gamesArray = games.array();

    gamesArray.sort(function (a, b) {
        return a.name > b.name;
    });



    if (gamesArray) {
        let embed = new Discord.RichEmbed();
        let description = ``;
        let footer = (`Liste générée le ${moment().format('DD.MM.YYYY')} à ${moment().format('HH:mm')}`);

        gamesArray.forEach(game => {
            if (game.name !== "" && game.actif == true) {
                let gameRole = guild.roles.get(game.roleID);
                if (gameRole) {
                    let totalMembers = guild.roles.get(game.roleID).members.size;
                    description += `${game.emoji} : ${game.name} \`${totalMembers}👤\`\n`;
                };
            }
        });

        embed.setTitle(`Liste des jeux`);
        embed.setColor(0xF1C40F);
        embed.setDescription(description);
        embed.setFooter(footer);
        embed.setImage(`https://media.discordapp.net/attachments/599235210550181900/645313787376697344/ligne_horizontale_2F3136.png`);

        return embed;
    }
};

exports.newPlayerNotification = async (client, game, member) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);


    const gameTextChannel = await guild.channels.get(game.textChannelID);

    let avatar;
    if (!member.user.avatarURL) {
        avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
    } else {
        avatar = member.user.avatarURL;
    }

    if (gameTextChannel) {
        const welcomeMessage = new RichEmbed()
            .setColor(colors['darkviolet'])
            .setThumbnail(avatar)
            .setDescription(client.textes.get("GAMES_JOIN_NOTIFICATION", game, member));
        welcomeChannel.send(welcomeMessage);
    };


}