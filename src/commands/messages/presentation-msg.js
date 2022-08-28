const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	name: "presentation-msg",
	description: "Envoie le boutton de présentation",
	type: ["cmd"],
	deletemsg: true,

	run: async(client, message, args) => {
		const presentationButton = new ButtonBuilder().setCustomId("presentation").setLabel("📝 Rédiger ma présentation").setStyle(ButtonStyle.Success);
    let socialButton = new ButtonBuilder().setCustomId("add-social-presentation").setLabel("Ajouter mes réseaux sociaux").setStyle(ButtonStyle.Secondary)
    let deleteButton = new ButtonBuilder().setCustomId("delete-presentation").setLabel("🗑 Supprimer ma présentation").setStyle(ButtonStyle.Danger)
		await message.channel.send({
			content: `Vous avez la possibilité de rédiger votre présentation en cliquant sur le boutton ci-dessous.\nCertaines informations, comme l'age, la région, les pronoms/genre seront automatiquement ajoutés si vous les avez renseignés dans les rôles. \nUne fois la présentation faite, vous pourrez la publier, elle sera ainsi publiée dans ce salon et accessible sur votre profile par tous les membres du serveur.`,
			components: [new ActionRowBuilder().addComponents([presentationButton, socialButton, deleteButton])]
		});
	},
};