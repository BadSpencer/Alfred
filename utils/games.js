const moment = require("moment");
const Discord = require("discord.js");

exports.check = async () => {
    const guild = client.guilds.get(client.config.guildID);
    const games = client.gamesGetAll();

    if (!games) return;

    games.forEach(game => {
        this.client.logger.log(`Vérifications pour le jeu ${game.name}`)

        if (game.actif == "0") {
            this.client.logger.log(`${game.name} n'est pas actif. Contrôles annulés.`)
            return;
        }
    });
};

exports.PostRoleReaction = async (client) => {
    const guild = client.guilds.get(client.config.guildID);
    const settings = await client.db.getSettings(client);
    const games = await client.db.gamesGetActive(client);

    const gameJoinChannel = await guild.channels.find(c => c.name === settings.gameJoinChannel);

    let embed = new Discord.RichEmbed(await client.games.gameGetListEmbed(client));

    let gameJoinMessage = undefined;
    if (settings.gameJoinMessage !== "") {
        gameJoinMessage = await gameJoinChannel.fetchMessage(settings.gameJoinMessage).catch(err =>{client.logger.log(`Liste de jeux non trouvée. Une nouvelle liste est postée`)});
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
    } else {
        gameJoinMessage.edit(embed);
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