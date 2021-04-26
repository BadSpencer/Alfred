const Discord = require("discord.js");
const {
    Listener
} = require("discord-akairo");
const chalk = require('chalk');
const moment = require('moment');


class guildMemberAddListener extends Listener {
    constructor() {
        super('guildMemberAdd', {
            emitter: 'client',
            event: 'guildMemberAdd'
        });
    }

    exec(member) {
        let client = this.client;

        this.client.memberLogServerJoin(member.id);

        let imageUrl = 'https://i.imgur.com/vgxCFJ3.png';

        let userdata = this.client.userdataGet(member.id);
        if (userdata) {
            // setTimeout(function () {
            //     client.serverJoinInformationAgain(member);
            // }, 500);

            let memberLogs = client.db_memberLog.filterArray(memberLog =>
                memberLog.memberID === member.id &&
                memberLog.type === 'SERVERQUIT' ||
                memberLog.type === 'SERVERKICK' ||
                memberLog.type === 'SERVERBAN');

            memberLogs.sort(function (a, b) {
                return a.createdAt - b.createdAt;
            }).reverse();

            this.client.modLogEmbed(client.textes.get("MOD_NOTIF_SERVER_JOIN_AGAIN", member, userdata, memberLogs[0]), 'REJOIN');
        } else {
            this.client.userdataCreate(member);
            // setTimeout(function () {
            //     client.serverJoinInformation(member);
            // }, 500);

            

            client.modLogEmbed(client.textes.get("MOD_NOTIF_SERVER_JOIN", member), 'JOIN');
        }

        let embed = new Discord.MessageEmbed();

        embed.setTitle('Discord Casual Effect:');
        embed.setImage(imageUrl);
        embed.setDescription(`Avant de vous donner les droits d'envoyer des messages sur ce discord, je dois m'assurer que vous n'êtes pas un de ces satanés bots. Je déteste la concurrence !
        
        Veuillez m'indiquez le nom du personnage qui figure sur l'image ci-dessous`);
        embed.setFooter(`Indice: 4a commande par "Ma" et ça fini par "rio"`);

        member.send(embed);

    }
}

module.exports = guildMemberAddListener;