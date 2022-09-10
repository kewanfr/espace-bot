const { SlashCommandBuilder, Routes } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	dev: true,
	async execute(client) {
		
		let commands = client.slashCommands.map(cmd => cmd.slash);
		if (commands.length > 0) {
			client.rest.put(Routes.applicationGuildCommands(client.config.clientId, client.config.guildId), { body: commands })
      .then(() => client.log.client('Commandes slash chargées avec succès.'))
      .catch(console.error);
		}
		client.log.ready(`Connecté en tant que ${client.user.tag}`);
	},
};