const Discord = require("discord.js");
const moment = require("moment");
const colors = require('./colors');
const constants = require('./constants');
const datamodel = require('./datamodel');

module.exports = (client) => {
    /**
     * Cette méthode retourne une page fixe de l'aide en ligne
     * @param {number} page Le n° de la page à afficher
     * @param {number} totalPages Le nombre total de pages
     * @param {string} preDescription Texte à insérer avant le texte principal
     * @param {string} postDescription Texte à insérer après le texte principal
     * @returns {embed}
     */
    client.aideGetAideEmbedPage = async (page, totalPages, preDescription = null, postDescription = null) => {
        let embed = new Discord.RichEmbed();
        let texteTitle = `AIDE_EMBED_TITLE_${page}`;
        let texteDescription = `AIDE_EMBED_DESCRIPTION_${page}`;

        let description = "";
        if (preDescription !== null) description += preDescription;
        description += client.textes.get(texteDescription);
        if (postDescription !== null) description += postDescription;

        embed.setColor(colors['darkgreen']);
        embed.setTitle(client.textes.get(texteTitle));
        embed.setDescription(description);
        embed.setFooter(`Page: ${page}/${totalPages}`);
        return embed;
    };



}