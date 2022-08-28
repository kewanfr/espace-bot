const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const command = () => {
	const button = new ButtonBuilder().setCustomId("birthdate-btn").setLabel("Ma date de naissance").setStyle(ButtonStyle.Primary);

	return {
		components: [new ActionRowBuilder().addComponents([button])]
	};
}

module.exports = {
	name: "birthdate",
	description: "Bouton pour la date de naissance",
	type: ["slash", "cmd"],
	aliases: ["bouton"],
	build: new SlashCommandBuilder().setName("birthdate").setDescription("Bouton pour la date de naissance"),
	deletemsg: false,

	run: async(client, message, args) => {
		await message.channel.send(command());
	},
	runSlash: async(client, interaction) => {
		await interaction.reply(command());
	}
};