const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	name: "ticket-msg",
	description: "Envoie le message de création de Ticket",
	type: ["cmd"],
	deletemsg: true,

	run: async(client, message, args) => {


		const Embed = new EmbedBuilder()
			.setTitle("Ouvrir un ticket")
			.setAuthor({name: `${message.guild.name}`, iconURL: message.guild.iconURL()})
			.setDescription(
`**Une question, un problème, une demande d'aide ?**
Vous pouvez utiliser le système de tickets pour obtenir de l'aide.

Cliquez sur le boutton qui convient à votre demande ci-dessous pour créer un ticket.
`)
.setColor('Aqua');

		const Buttons = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId("ticket-question")
				.setLabel("Question ?")
				.setStyle(ButtonStyle.Primary)
				.setEmoji('❓'),
			new ButtonBuilder()
				.setCustomId("ticket-probleme")
				.setLabel("Problème ?")
				.setStyle(ButtonStyle.Danger)
				.setEmoji('⚠'),
			new ButtonBuilder()
				.setCustomId("ticket-partenariat")
				.setLabel("Demande de partenariat")
				.setStyle(ButtonStyle.Success)
				.setEmoji('🤝'),
			new ButtonBuilder()
				.setCustomId("ticket-autre")
				.setLabel("Autre demande")
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('🧩'),
		);

		await message.channel.send({
			embeds: [Embed],
			components: [Buttons]
		});
	},
};