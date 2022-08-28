const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "ping",
	description: "Ping le bot",
	type: ["slash", "cmd"],
	aliases: ["latence"],
	build: new SlashCommandBuilder().setName("ping").setDescription("Ping le bot"),
	deletemsg: false,
	run: async(client, message, args) => {
		const msg = await message.channel.send(`🏓 Pong!\n\`${client.ws.ping}ms\``);
		const newMsg = `🏓 Pong!\nPing de l'API: ${client.ws.ping}ms\nPing du Client: ${msg.createdTimestamp - message.createdTimestamp}ms`;
		msg.edit(newMsg);
	},
	runSlash: async(client, interaction) => {
		const message = await interaction.deferReply({
			fetchReply: true
		});
		const newMessage = `🏓 Pong!\nPing de l'API: ${client.ws.ping}ms\nPing du Client: ${message.createdTimestamp - interaction.createdTimestamp}ms`;
		await interaction.editReply({
			content: newMessage
		});
	}
};