const Discord = require('discord.js');
const hexColorRegex = require('hex-color-regex');
const colors = require('./colors');

// Some useful additions to String prototypes
// Capitalizes the first letter in a string, and if onlyFirst is not true, convert all other letters to lowercase
String.prototype.toTitleCase = function (onlyFirst) {
    const first = this.charAt(0).toUpperCase();
    const rest = (onlyFirst) ? this.substr(1) : this.substr(1).toLowerCase();
    return first + rest;
};
// Applies toTitleCase() to all words in a string, separated by a delimeter
String.prototype.toTitleCaseAll = function (delim, onlyFirst) {
    const d = delim || ' ';
    return this.split(d).reduce((acc, cur) => {
        if (acc == '') return cur.toTitleCase(onlyFirst);
        return acc + d + cur.toTitleCase(onlyFirst);
    }, '');
};

module.exports = {

    emoji: {
        enabled: {
            true: '✅',
            false: '❌',
        },
    },
    

    random: function (array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    randomObject: function(obj) {
        var keys = Object.keys(obj)
        return obj[keys[keys.length * Math.random() << 0]];
    },

    deleteMessageAfterSent: function(message, content, interval) {
        // String to integer (string => number)
        let ms = parseInt(interval);
        // Must always be a string
        if (typeof content !== 'string') return console.error;
        // If interval was not put, set a default one
        if (!ms) interval = 5000;
    
        return message.channel.send(content).then(msg => msg.delete(interval));
    },

    embedMessage: function(message, content, hex) {
        let regex = hexColorRegex().test(hex);
        let embed = new Discord.RichEmbed()
            .setDescription(`${content}`);
        if (regex === true) {
            embed.setColor(hex)
        } else {
            embed.setColor(0x36393E);
        }
        return message.channel.send({ embed });
    },

    grabEmoji: function(client, emoji) {
        let grabbed = client.emojis.get(emoji)
        return grabbed;
    },
    

    duration: function duration(ms) {
        const sec = Math.floor((ms / 1000) % 60).toString()
        const min = Math.floor((ms / (1000 * 60)) % 60).toString()
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
        const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
          return `\`${days.padStart(1, '0')} jours, ${hrs.padStart(2, '0')} heures, ${min.padStart(2, '0')} minutes, et ${sec.padStart(2, '0')} secondes\``
    },

    generateKey: function() {
        const characters = 'ABCEFGHJKLNPQRSTUWXYZ1245780';
        let output = '';

            for ( var i = 0; i < 5; i += 1 ) {
                for (let y = 0; y < 4; y += 1) {
                    const random = Math.floor((Math.random() * 35) + 1);
                    const char = characters.charAt(random);
                    output += char;
                }
              
                if (i !== 5) {
                    output += '-';
                }
            }

        return output;

    },

    longDate: function(date) {
        return new Date(date).toLocaleString('en-GB', { dateStyle: 'full'})
    },

    shortDate: function(date) {
        return new Intl.DateTimeFormat('en-GB').format(date);
    },

    trim: function(str, max) {
            if(!str) throw new TypeError('Trim Function Error', 'Must define the string to trim');
            if(!max) throw new TypeError('Trim Function Error', 'Must define how much to trim');
        ((str.length > max) ? `${str.slice(0, max, - 3)}...` : str);
    },

    cleanCode: function(text) {
        if(typeof(text) === 'string') 
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
    },

    formatName: function(str) {
        return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
    }
} 