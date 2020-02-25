const moment = require("moment");
const Discord = require("discord.js");
const {
    RichEmbed
} = require('discord.js');
const colors = require('./colors');
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage
} = require('./messages');



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
            .setColor(colors['darkgreen'])
            .setThumbnail(avatar)
            .setDescription(client.textes.get("GAMES_JOIN_NOTIFICATION", game, member));
        gameTextChannel.send(welcomeMessage);
    };


}
exports.quitPlayerNotification = async (client, game, member) => {
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
            .setColor(colors['orange'])
            .setThumbnail(avatar)
            .setDescription(client.textes.get("GAMES_QUIT_NOTIFICATION", game, member));
        gameTextChannel.send(welcomeMessage);
    };


}
exports.notifyPlayerActiveGame = async (client, member, game) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);

    const gameRole = guild.roles.get(game.roleID);
    const gameJoinChannel = await guild.channels.find(c => c.name === settings.gameJoinChannel);

    const notification = new RichEmbed()
        .setColor(colors['darkviolet'])
        .setDescription(client.textes.get("GAMES_ACTIVE_NOTIFICATION", game, member, gameRole, gameJoinChannel));
    member.send(notification);

}

exports.createUsergame = async (client, game, member) => {

    let usergameKey = `${game.name}-${member.id}`;
    let usergame = client.db_usergame.get(usergameKey);
    if (!usergame) {
        usergame = client.db_usergame.get("default");
        usergame.id = usergameKey;
        usergame.userid = member.id;
        usergame.gameid = game.name;
        client.logger.log(client.textes.get("LOG_EVENT_USERGAME_CREATED", member, game));
        if (game.actif && !member.roles.has(game.roleID)) {
            client.games.notifyPlayerActiveGame(client, member, game);
        }
    }
    usergame.lastPlayed = +new Date;
    client.db_usergame.set(usergameKey, usergame);
}
exports.updateJoinUsergame = async (client, game, member) => {

    let usergameKey = `${game.name}-${member.id}`;
    let usergame = client.db_usergame.get(usergameKey);

    usergame.id = usergameKey;
    usergame.userid = member.id;
    usergame.gameid = game.name;
    usergame.joinedAt = +new Date;
    usergame.joinedDate = moment().format('DD.MM.YYYY');
    usergame.joinedTime = moment().format('HH:mm');

    client.db_usergame.set(usergameKey, usergame);
}
exports.updateQuitUsergame = async (client, game, member) => {

    let usergameKey = `${game.name}-${member.id}`;
    let usergame = client.db_usergame.get(usergameKey);
    if (usergame) {
        usergame.joinedAt = "";
        usergame.joinedDate = "";
        usergame.joinedTime = "";
    }
    client.db_usergame.set(usergameKey, usergame);
}

exports.quitConfirmation = async (client, messageReaction, game, member) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    const gameRole = guild.roles.get(game.roleID);
    let statusMessage = await questionMessage(client.textes.get("GAMES_JOIN_WANT_TO_QUIT", game.name), messageReaction.message.channel);
    const responses = await messageReaction.message.channel.awaitMessages(msg => msg.author.id === member.id, {
        max: 1,
        time: 10000,
    });

    if (responses.size !== 1) {
        warnMessage(client.textes.get("GAMES_QUIT_CANCEL"), messageReaction.message.channel);
        return null;
    }
    const response = responses.first();

    if (response.content == "oui") {
        response.delete();
        member.removeRole(gameRole);
        successMessage(client.textes.get("GAMES_QUIT_SUCCESS", game.name), messageReaction.message.channel);
    } else {
        response.delete();
        warnMessage(client.textes.get("COM_ACTION_ANNULLE"), messageReaction.message.channel);
        return null;
    }
}