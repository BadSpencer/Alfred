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
        await client.db.usergameCheck(client);
        await client.db.postedEmbedsCheck(client);
        await client.db.textesCheck(client);




        let activityCheck = new cron.CronJob('00 * * * * *', () => { // Toutes les minutes
            client.exp.activityCheck(client);
        });
        let messageOfTheDay = new cron.CronJob('00 00 09 * * *', () => { // Tous les jours à 9h
            client.core.messageOfTheDay(client);
        });

        activityCheck.start();
        messageOfTheDay.start();

        client.logger.log(`Alfred v${pjson.version} prêt !`, `ready`);

    }
}

module.exports = ReadyListener;