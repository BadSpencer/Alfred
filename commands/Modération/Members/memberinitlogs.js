const {
    Command
} = require("discord-akairo");
const {
    Permissions
} = require("discord.js");
const {
    successMessage,
    errorMessage,
    warnMessage,
    questionMessage,
    promptMessage
} = require('../../../utils/messages');
const colors = require('../../../utils/colors');
const Enmap = require("enmap");


class KickCommand extends Command {
    constructor() {
        super('member-initlogs', {
            aliases: ['minit'],
            category: 'Modération',
            description: {
                content: 'Réinitialiser les logs/xp',
                usage: '',
                examples: ['']
            }
        });
    }

    * args(message) {
        // const userdata = yield {
        //     type: 'userdata', 
        //     prompt: {
        //         start: message => promptMessage('Quel membre souhaitez vous expulser ?'),
        //         retry: message => promptMessage('Mentionnez un membre avec son ID')
        //     }
        // };
        // const raison = yield {
        //     type: 'content', 
        //     match: 'rest',
        //     prompt: {
        //         start: message => promptMessage(`Pour quelle raison souhaitez vous expulser **${userdata.displayName}** ?`),
        //         retry: message => promptMessage(`Pour quelle raison souhaitez vous expulser **${userdata.displayName}** ?`)
        //     }
        // };
        // return { userdata, raison };
    }

    async exec(message, args) {
        let client = this.client;
        const guild = client.getGuild();

        client.db_memberLog.destroy();
        client.db_memberLog = new Enmap({
            name: "memberLog"
        });

        client.db_messageslogs.destroy();
        client.db_messageslogs = new Enmap({
            name: "messageslogs"
        });

        client.db_commandsLogs.destroy();
        client.db_commandsLogs = new Enmap({
            name: "commandsLogs"
        });

        let userdatas = client.userdataGetAll(true);
        for (const userdata of userdatas) {
            userdata.xp = 0;
            userdata.level = 0;
            client.userdataSet(userdata);
        }

        guild.channels.cache.forEach(async channel => {
            if (channel.type === 'text') {
                client.channelGetAllMessages(channel.id).then(
                    messages => {
                        for (const ObjectMessage of messages) {
                            let message = ObjectMessage[1];
                            if (!message.author.bot) {
                                if (message.content.startsWith("!")) {
                                    client.commandHandler.parseCommand(message).then(
                                        ParsedComponentData => {
                                            if (ParsedComponentData.command) {
                                                client.commandLog(message, ParsedComponentData.command);
                                                client.memberLogCmd(message.author.id, message.createdTimestamp, 5);
                                            }
                                        }
                                    )
                                } else {
                                    client.messageLog(message);
                                    client.memberLogText(message.author.id, message, message.createdTimestamp);
                                }
                            }
                        }
                    }
                )
            }
        });

        
        const regex = /"(.*?)"/m;

        for (const userdata of userdatas) {
            for (const log of userdata.logs) {
                switch (log.event) {
                    case "JOIN":
                        client.memberLogServerJoin(userdata.id, log.createdAt);
                        break;
                    case "QUIT":
                        client.memberLogServerQuit(userdata.id, log.createdAt);
                        break;
                    case "MEMBER":
                        client.memberLogMember(userdata.id, log.createdAt);
                        break;
                    case "NOTE":
                        client.memberLogNote(userdata.id, log.createdBy, log.commentaire, log.createdAt);
                        break;
                    case "KICK":
                        client.memberLogKick(userdata.id, log.createdBy, log.commentaire, log.createdAt);
                        break;
                    case "NICK":
                        let nickSplit = log.commentaire.split(" -> ");
                        let nickOld = nickSplit[0];
                        let nickNew = nickSplit[1];
                        client.memberLogNick(userdata.id, nickOld, nickNew, log.createdAt)
                        break;
                    case "GAMEJOIN":
                        let gamejoinPhrase = regex.exec(log.commentaire);
                        let gamejoin = client.gamesGet(gamejoinPhrase[0]);
                        if (gamejoin) {
                            client.memberLogGameJoin(userdata.id, gamejoin, log.createdAt);
                        }
                        break;
                    case "GAMEQUIT":
                        if (log.commentaire.includes("Inactivité")) {
                            let gamequitPhrase = regex.exec(log.commentaire);
                            let gamequit = client.gamesGet(gamequitPhrase[0]);
                            if (gamequit) {
                                client.memberLogGameIdle(userdata.id, gamequit, log.createdAt);
                            }
                        } else {
                            let gamequitPhrase = regex.exec(log.commentaire);
                            let gamequit = client.gamesGet(gamequitPhrase[0]);
                            if (gamequit) {
                                client.memberLogGameQuit(userdata.id, gamequit, log.createdAt);
                            }
                        }
                        break;
                }
            }

        }







    }
}


module.exports = KickCommand;