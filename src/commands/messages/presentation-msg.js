const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	help: {
		name: "presentation-msg",
		description: "Envoie le msg du salon presentation",
		slash: false,
		category: "messages",
		aliases: ["presentation-msg"],
		usage: "presentation-msg",
		cooldown: 5,
		permission: "Administrator",
		deletemsg: true,
	},
	run: async(client, message, args) => {
		const presentationButton = new ButtonBuilder().setCustomId("edit-presentation").setLabel("📝 Rédiger ma présentation").setStyle(ButtonStyle.Success);
    let socialButton = new ButtonBuilder().setCustomId("add-social-presentation").setLabel("Ajouter mes réseaux sociaux").setStyle(ButtonStyle.Secondary)
    let deleteButton = new ButtonBuilder().setCustomId("delete-presentation").setLabel("🗑 Supprimer ma présentation").setStyle(ButtonStyle.Danger)
		await message.channel.send({
			content: `<#1012076429099405483>:\n\nVous avez la possibilité de rédiger votre présentation en cliquant sur le bouton ci-dessous.\nCertaines informations, comme l'age, la région, les pronoms/genre seront automatiquement ajoutés si vous les avez renseignés dans les rôles. \nUne fois la présentation faite, vous pourrez la publier, elle sera disponible dans le salon <#1012076429099405483> et accessible sur votre profile par tous les membres du serveur.`,
			components: [new ActionRowBuilder().addComponents([presentationButton, socialButton, deleteButton])]
		});
	},
};