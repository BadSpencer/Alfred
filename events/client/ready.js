const {
    Listener
} = require('discord-akairo');
const cron = require('cron');

const datamodel = require('../../utils/datamodel');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            eventName: 'ready'
        });
    }

    async exec() {
        let client = this.client;
        const pjson = require('../../package.json');
        this.client.user.setActivity(`v${pjson.version}`, {
            type: "PLAYING"
        });

        await client.db.settingsCheck(client);


        await client.db.userdataCheck(client);
        await client.db.userlogsCheck(client);
        await client.db.embedsCheck(client);
        await client.db.gamesCheck(client);
        await client.checkGameServers();
        await client.db.usergameCheck(client);
        await client.db.postedEmbedsCheck(client);
        await client.db.textesCheck(client);




        let activityCheck = new cron.CronJob('00 * * * * *', () => { // Toutes les minutes
            client.exp.activityCheck(client);
        });
        let serversStatus = new cron.CronJob('5 * * * * *', () => { // Toutes les minutes après 5sec
            client.gameServersStatus();
        });
        let serversInfos = new cron.CronJob('10 * * * * *', () => { // Toutes les minutes après 10sec
            client.gameServersPostStatusMessage();
        });
        let messageOfTheDay = new cron.CronJob('00 00 09 * * *', () => { // Tous les jours à 9h
            client.messageOfTheDay();
        });
        let gameList = new cron.CronJob('10 00 */1 * * *', () => { // Tous les heures après 10sec
            client.games.PostRoleReaction(client);
        });
        /*
        let ArkDWD = new cron.CronJob('00 05 06 * * *', () => { // Tous les jours à 6h05
            client.gameServersArkDWD();
        });
        */


        activityCheck.start();
        messageOfTheDay.start();
        gameList.start();
        serversStatus.start();
        serversInfos.start();

        client.logger.log(`Alfred v${pjson.version} prêt !`, `ready`);

    }
}

module.exports = ReadyListener;