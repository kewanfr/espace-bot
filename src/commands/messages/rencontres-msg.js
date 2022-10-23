const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const command = () => {
	const button = new ButtonBuilder().setCustomId("recherche-btn").setLabel("📝 Rédiger mon message").setStyle(ButtonStyle.Success);

	return {
		content: `<#1013533028309549066>:\n\nVous avez la possibilité de rédiger un court message pour indiquer ce que vous recherchez sur le serveur en cliquant sur le bouton ci-dessous.\nCe message sera publié dans le salon <#1013533028309549066>.`,
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