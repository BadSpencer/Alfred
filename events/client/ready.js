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

        client.logger.log(`Vérification de l'intégrité de la base de données`);

        await client.db.settingsCheck(client);
        await client.db.userdataCheck(client);
        await client.db.userlogsCheck(client);
        await client.db.gamesCheck(client);
        await client.db.usergameCheck(client);
        await client.db.postedEmbedsCheck(client);

        client.logger.log(`Fin des contrôles`);

        
        let activityCheck = new cron.CronJob('00 * * * * *', () => { // Toutes les minutes
            client.exp.activityCheck(client);
        });

        activityCheck.start();

        client.logger.log(`Alfred v${pjson.version} prêt !`, `ready`);
        
    }
}

module.exports = ReadyListener;