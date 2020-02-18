const moment = require("moment");

exports.CreateMainRole = async () => {

    
}
exports.check = async () => {
    const guild = client.guilds.get(client.config.guildID);
    const games = client.gamesGetAll();

    if(!games) return;

    games.forEach(game => {
        this.client.logger.log(`Vérifications pour le jeu ${game.name}`)

        if(game.actif == "0") {
            this.client.logger.log(`${game.name} n'est pas actif. Contrôles annulés.`)
            return;
        }
    });
};