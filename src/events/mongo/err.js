const chalk = require('chalk');

module.exports = {
  name: "err",
  execute(err) {
    console.log(chalk.red(`[Database Status]: Une erreur s'est produite avec la base de données!\n${err}`));
  }
}