const Discord = require("discord.js");
const {
    Listener
} = require("discord-akairo");
const chalk = require('chalk');
const moment = require('moment');
const datamodel = require("../../utils/datamodel");

class inviteDeleteListener extends Listener {
    constructor() {
        super('inviteDelete', {
            emitter: 'client',
            event: 'inviteDelete'
        });
    }

    async exec(invite) {
        this.client.db_invites.delete(invite.code);
    }
}

module.exports = inviteDeleteListener;