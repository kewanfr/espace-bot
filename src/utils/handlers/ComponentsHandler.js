const { readdirSync } = require('fs');

module.exports = async (client) => {
  const { log } = client;
  const componentFolders = readdirSync(`${process.cwd()}/src/components`);
  for(const folder of componentFolders){
    const componentFiles = readdirSync(`${process.cwd()}/src/components/${folder}`).filter(file => file.endsWith('.js'));

    const {buttons, selectMenus, modals} = client;

    switch(folder){
      case 'buttons':
        for(const file of componentFiles){
          const button = require(`${process.cwd()}/src/components/${folder}/${file}`);
          log.component(`- ${button.data.name}`, "BTN");
          buttons.set(button.data.name, button);
        }
        break;

      case "selectMenus":
        for(const file of componentFiles){
          const menu = require(`${process.cwd()}/src/components/${folder}/${file}`);
          log.component(`- ${menu.data.name}`, "MENU");
          selectMenus.set(menu.data.name, menu);
        }
        break;

      case "modals":
        for(const file of componentFiles){
          const modal = require(`${process.cwd()}/src/components/${folder}/${file}`);
          // console.log(`Composant chargé: ${modal.data.name}`);
          log.component(`- ${modal.data.name}`, "MODAL");
          modals.set(modal.data.name, modal);
        }
        break;
        
      default:

        break;
    }
  }
};