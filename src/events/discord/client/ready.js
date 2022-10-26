const { Routes } = require("discord.js");
const Data = require("../../../schemas/dataModel");
const {
  birthdateUpdateExecute,
} = require("../../../utils/functions/featuresFunctions");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    let commands = client.slashCommands.map((cmd) => cmd.slash);
    client.rest
      .put(
        Routes.applicationGuildCommands(
          client.config.clientId,
          client.config.guildId
        ),
        { body: commands }
      )
      .then(() => client.log.client("Commandes slash chargées avec succès."))
      .catch(console.error);
    client.log.ready(`Connecté en tant que ${client.user.tag}`);

    birthdateUpdateExecute(client);

    client.emit("statsChannelsUpdate");
  },
};
