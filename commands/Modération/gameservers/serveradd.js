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
            category: 'Modérations',
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
                    id: "portrcon",
                    type: "number",
                    prompt: {
                        start: 'Quelle est le port RCON du serveur ?',
                        retry: 'Veuillez saisir un port valide !'
                    }
                },
                {
                    id: "pwdrcon",
                    prompt: {
                        start: 'Quelle est le mot de passe ADMIN/RCON du serveur ?',
                        retry: 'Veuillez saisir un mot de passe valide !'
                    }
                },
                {
                    id: "portftp",
                    type: "number",
                    prompt: {
                        start: 'Quelle est le port FTP du serveur ?',
                        retry: 'Veuillez saisir un port valide !'
                    }
                },
                {
                    id: "userftp",
                    prompt: {
                        start: 'Quelle est le user FTP du serveur ?',
                        retry: 'Veuillez saisir un mot de passe valide !'
                    }
                },
                {
                    id: "pwdftp",
                    prompt: {
                        start: 'Quelle est le mot de passe FTP du serveur ?',
                        retry: 'Veuillez saisir un mot de passe valide !'
                    }
                }
            ]
        });
    }
    async exec(message, args) {
        let client = this.client;
        await client.gameServersAddServer(message, args.game.name, args.name, args.ip, args.portrcon, args.pwdrcon, args.portftp, args.userftp, args.pwdftp);
        if (message.channel.type === 'text') message.delete();
    }

}
module.exports = ServerAddCommand;