const {
    Listener
} = require("discord-akairo");
const cron = require('cron');

const datamodel = require('../../utils/datamodel');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec() {
        let client = this.client;
        const pjson = require('../../package.json');
        this.client.user.setActivity(`v${pjson.version}`, {
            type: "PLAYING"
        });

        client.settingsCheck();
        // Normalisation des enregistrements de la BD pour qu'ils aient la même 
        // structure que définie dans datamodel
        // client.datamodelCheck();
        client.userdataCheck();
        // client.gamesCheck();
        client.textesCheck();


        if (!client.cron_activityCheck.running) client.cron_activityCheck.start();
        if (!client.cron_messageOfTheDay.running) client.cron_messageOfTheDay.start();
        if (!client.cron_gameList.running) client.cron_gameList.start();

        if (!client.cron_serversStatus.running) client.cron_serversStatus.start();
        if (!client.cron_serverMaintenanceOn.running) client.cron_serverMaintenanceOn.start();
        if (!client.cron_serverMaintenanceOff.running) client.cron_serverMaintenanceOff.start();
        if (!client.cron_serverUpdateInfos.running) client.cron_serverUpdateInfos.start();

        if (!client.cron_serversInfos.running) client.cron_serversInfos.start();

        if (!client.cron_gamePurge.running) client.cron_gamePurge.start();

        if (!client.cron_karma.running) client.cron_karma.start();

        client.logger.log(`Alfred v${pjson.version} prêt !`, `ready`);

        client.gamesJoinListPost(true);

    }
}

module.exports = ReadyListener;