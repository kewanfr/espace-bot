const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const command = () => {
	const button = new ButtonBuilder().setCustomId("recherche-btn").setLabel("Je recherche").setStyle(ButtonStyle.Primary);

	return {
		components: [new ActionRowBuilder().addComponents([button])]
	};
}

module.exports = {
	help: {
		name: "rencontres-msg",
		description: "Envoie le message de rencontres",
		slash: false,
		category: "messages",
		aliases: ["rencontres-msg"],
		usage: "rencontres-msg",
		cooldown: 5,
		permission: "Administrator",
		deletemsg: true,
	},
	run: async(client, message, args) => {
		await message.channel.send(command());
	},
};