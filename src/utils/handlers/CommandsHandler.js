const {promisify} = require('util');
const { glob } = require("glob");
const { PermissionFlagsBits } = require('discord.js');
const pGlob = promisify(glob);

module.exports = async (client) => {
  const { log } = client;
  (await pGlob(`${process.cwd()}/src/commands/*/*.js`)).forEach((cmdFile) => {
    const cmd = require(cmdFile);

    if(cmd.help?.slash == "both" || cmd.help?.slash == true || cmd.help?.context == true) {
      cmd.slash.forEach((slash) => {
        if(!cmd.help.context) {
        if(!slash.name) return log.warn(`Commande slash non-chargée: pas de nom ⬇\nFichier -> ${cmdFile}`);
        if(!slash.description) return log.warn(`Commande slash non-chargée: pas de description ⬇\nFichier -> ${cmdFile}`);

        // if(!slash.default_member_permissions) log.typo(`Pas de permission par défaut ⬇\nFichier -> ${cmdFile}`);

        slash.options?.forEach((option) => {
          if(!option.name) return log.typo(`Commande slash: pas de nom d'option ⬇\nFichier -> ${cmdFile}`);
          if(!option.description) return log.warn(`Commande slash: pas de description d'option ⬇\nFichier -> ${cmdFile}`);
          if(!option.type) return log.typo(`Commande slash: pas de type d'option ⬇\nFichier -> ${cmdFile}`);
        });
      }
        if(slash.default_member_permissions){
          if(typeof slash.default_member_permissions == "string") slash.default_member_permissions = PermissionFlagsBits[slash.default_member_permissions];
  
          slash.default_member_permissions = slash.default_member_permissions.toString();
        }

        let cmdObject = { slash, help: cmd.help, runSlash: cmd.runSlash };
        if(cmd.runContextMenu) cmdObject.runContextMenu = cmd.runContextMenu;
        if(cmd.runSlash) cmdObject.runSlash = cmd.runSlash;

        client.slashCommands.set(slash.name, cmdObject);
        log.slashCommand(`- ${slash.name}`);

      });
    }

    if(cmd.help?.slash == "both" || cmd.help?.slash == false) {
      
      if(!cmd.help.name) return log.warn(`Commande non-chargée: pas de nom ⬇\nFichier -> ${cmdFile}`);

      if(!cmd.help.description) return log.warn(`Commande non-chargée: pas de description ⬇\nFichier -> ${cmdFile}`);

      if(!cmd.help.category) log.typo(`Commande: pas de catégorie ⬇\nFichier -> ${cmdFile}`);

      if(!cmd.help.usage) log.typo(`Commande: pas d'utilisation ⬇\nFichier -> ${cmdFile}`);
      if(cmd.help.permission){
        if(typeof cmd.help.permission == "string") cmd.help.permission = PermissionFlagsBits[cmd.help.permission];
  
        cmd.help.permission = cmd.help.permission.toString();
      }

      // if(!cmd.help.permission) log.typo(`Commande: pas de permission ⬇\nFichier -> ${cmdFile}`);
        
      client.commands.set(cmd.help.name, cmd);
      log.command(`- ${cmd.help.name}`);
    }
    
  });

};