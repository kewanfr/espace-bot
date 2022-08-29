const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const command = () => {
	const button = new ButtonBuilder().setCustomId("birthdate-btn").setLabel("Ma date de naissance").setStyle(ButtonStyle.Primary);

	return {
		components: [new ActionRowBuilder().addComponents([button])]
	};
}

module.exports = {
	help: {
		name: "birthdate",
		description: "Envoie le bouton de birthdate",
		slash: false,
		category: "messages",
		aliases: ["birthdate"],
		usage: "birthdate",
		cooldown: 5,
		permission: "Administrator",
		deletemsg: true,
	},
	run: async(client, message, args) => {
		await message.channel.send(command());
	},
};