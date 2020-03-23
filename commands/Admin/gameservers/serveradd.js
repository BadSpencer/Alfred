const fs = require('fs');
const Discord = require("discord.js");
const {
    Permissions, MessageAttachment
} = require('discord.js');
const {
    Command
} = require('discord-akairo');
const {
    inspect
} = require("util");
const {
    successMessage,
    errorMessage,
    warnMessage
} = require('../../../utils/messages');
class ServerAddCommand extends Command {
    constructor() {
        super('serveradd', {
            aliases: ['serveradd', 'sadd'],
            category: 'Admin',
            userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
            description: {
                content: 'Ajouter un serveur de jeu',
                usage: '!sadd et laissez vous guider',
            },
            split: 'quoted',
            args: [
                {
                    id: "game",
                    type: "game",
                    prompt: {
                        start: 'Pour quel jeu souhaitez vous ajouter un serveur ?',
                        retry: 'Ce jeu est inconnu !'
                    }
                },
                {
                    id: "name",
                    prompt: {
                        start: 'Quelle est le nom de ce serveur ?',
                        retry: 'Veuillez saisir un nom'
                    }
                },
                {
                    id: "ip",
                    prompt: {
                        start: 'Quelle est l\'ip du serveur ?',
                        retry: 'Veuillez saisir une ip valide !'
                    }
                },
                {
                    id: "port",
                    type: "number",
                    prompt: {
                        start: 'Quelle est le port du serveur ?',
                        retry: 'Veuillez saisir un port valide !'
                    }
                },
                {
                    id: "password",
                    prompt: {
                        start: 'Quelle est le mot de passe du serveur ?',
                        retry: 'Veuillez saisir un mot de passe valide !'
                    }
                }
            ]
        });
    }
    async exec(message, args) {
        let client = this.client;

        let serverID = await client.gameAddServer(args.game.name, args.name, args.ip, args.port, args.password);
        successMessage(client.textes.get("GAMES_SERVER_ADD_SUCCESS", serverID), message.channel);
        message.delete();
    }

}
module.exports = ServerAddCommand;