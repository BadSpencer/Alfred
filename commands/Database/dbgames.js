const {
    Command
} = require('discord-akairo');

const defaultGames = {
    "name": "",
    "description": "",
    "actif": "0",
    "categorie": "",
    "discordTag": "",
    "roleID": "",
    "modRoleID": "",
    "playRoleID": "",
    "categoryID": "",
    "textChannelID": "",
    "infosChannelID": "",
    "statusChannelID": "",
    "voiceChannelID": "",
    "joinChannelID": "",
    "joinMessageID": "",
    "thumbnail": "",
    "image": "",
    "banner": "",
    "url": "",
    "reactEmoji": ""
  };

class dbGamesCommand extends Command {
    constructor() {
        super('dbgames', {
            aliases: ['dbgames', 'games', 'g'],
        });
    }

    *args() {
		const method = yield {
			type: [
				['dbgames-list', 'list'],
				['dbgames-add', 'add'],
			],
			otherwise: (message) => {
				const prefix = (this.handler.prefix)(message);
				return "Return sub command dbgames";
			},
		}

		return Flag.continue(method);
	}

    /*
    exec(message, args) {

        switch (args.action) {
            case 'liste': {



                break;
            }

            case 'add': {
                let newgame = defaultGames;
                newgame.name = args.gamename;
                newgame.discordTag = args.gamename;

                this.client.db_games.set(args.gamename, newgame);
                break;
            }

            case 'check': {
                this.client.games.check();
                break;
            }

        }

    }
    */
}

module.exports = dbGamesCommand;