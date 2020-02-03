const {
    Listener
} = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment');


class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            eventName: 'ready'
        });
    }

    exec() {
        const pjson = require('../../package.json');
        let timestamp = `${moment(new Date()).format("DD-MM-YY HH:mm:ss")}`;
        let ready = `Alfred v${pjson.version} prêt !`;

        this.client.user.setActivity(`v${pjson.version}`, {
            type: "PLAYING"
          });
        console.log(`${timestamp} | ${ready}`);
    }
}

module.exports = ReadyListener;