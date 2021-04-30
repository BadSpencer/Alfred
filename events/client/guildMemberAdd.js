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

    async exec(member) {
        let client = this.client;
        const guild = client.getGuild();
        const settings = client.getSettings(guild);

        this.client.memberLogServerJoin(member.id);

        let imageUrl = 'https://i.imgur.com/vgxCFJ3.png';

        let verifyBot = true;


        const invites = await member.guild.fetchInvites();
        const invite = invites.find(i => client.db_invites.get(i.code).uses < i.uses);

        if (invite) {
            if (invite.channel.type === 'voice') {
                verifyBot = false;
            } 
        }

        let userdata = this.client.userdataGet(member.id);
        if (userdata) {
            let memberLogs = client.db_memberLog.filterArray(memberLog =>
                memberLog.memberID === member.id &&
                memberLog.type === 'SERVERQUIT' ||
                memberLog.type === 'SERVERKICK' ||
                memberLog.type === 'SERVERBAN');

            memberLogs.sort(function (a, b) {
                return a.createdAt - b.createdAt;
            }).reverse();
            if (userdata.verified) {
                // Ne pas re-contrôler des membre qui l'ont déjà été par le passé
                verifyBot = false;
            }
            this.client.modLogEmbed(client.textes.get("MOD_NOTIF_SERVER_JOIN_AGAIN", member, userdata, memberLogs[0], invite, verifyBot), 'REJOIN');
        } else {
            userdata = this.client.userdataCreate(member);
            if (!verifyBot) {
                userdata.verified = true;
                this.client.userdataSet(userdata);
            }
            client.modLogEmbed(client.textes.get("MOD_NOTIF_SERVER_JOIN", member, invite), 'JOIN');
        }

        if (verifyBot) {
            let embed = new Discord.MessageEmbed();

            embed.setTitle('Casual Effect');
            embed.setImage(imageUrl);
            embed.setDescription(`Avant de vous donner les droits d'envoyer des messages sur ce discord, je dois m'assurer que vous n'êtes pas un de ces satanés bots. Je déteste la concurrence !
        
            **Veuillez m'indiquez le nom du personnage qui figure sur l'image ci-dessous**`);
            embed.setFooter(`Indice: ça commence par "Ma" et ça fini par "rio"`);

            member.send(embed);
        } else {
            let verifiedRole = guild.roles.cache.find(c => c.name === settings.verifiedRole);
            member.roles.add(verifiedRole);
        }

    }
}

module.exports = guildMemberAddListener;