const {promisify} = require('util');
const { glob } = require("glob");
const pGlob = promisify(glob);

module.exports = async (client) => {
  const { log } = client;
  (await pGlob(`${process.cwd()}/src/commands/*/*.js`)).forEach((cmdFile) => {
    const cmd = require(cmdFile);

    if(!cmd.name) return log.warn(`Commande non-chargée: pas de nom ⬇\nFichier -> ${cmdFile}`);

    if(!cmd.description) return log.warn(`Commande non-chargée: pas de description ⬇\nFichier -> ${cmdFile}`);

    // if(!cmd.category) return log.warn(`Commande non-chargée: pas de catégorie ⬇\nFichier -> ${cmdFile}`);

    if(cmd.type.includes("slash") || cmd.type.includes("context")){
      client.slashCommands.set(cmd.name, cmd);
      log.slashCommand(`- ${cmd.name}`);
    }

    if(cmd.type.includes("cmd")){
      client.commands.set(cmd.name, cmd);
      log.command(`- ${cmd.name}`);
    }
    
  });

};