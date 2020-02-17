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
        const pjson = require('../../package.json');
        this.client.user.setActivity(`v${pjson.version}`, {
            type: "PLAYING"
        });

        this.client.logger.log(`Vérification de l'intégrité de la base de données`);

        await this.client.db.settingsCheck(this.client);
        await this.client.db.userdataCheck(this.client);
        await this.client.db.gamesCheck(this.client);
        await this.client.db.usergameCheck(this.client);
        await this.client.db.postedEmbedsCheck(this.client);

        this.client.logger.log(`Fin des contrôles`);

        
        let activityCheck = new cron.CronJob('00 * * * * *', () => { // Toutes les minutes
            this.client.exp.activityCheck(this.client);
        });

        activityCheck.start();

        this.client.logger.log(`Alfred v${pjson.version} prêt !`, `ready`);
        
    }
}

module.exports = ReadyListener;