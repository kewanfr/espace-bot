const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	name: "rules",
	description: "Règlement",
	type: ["cmd"],
	deletemsg: true,

	run: async(client, message, args) => {
		const button = new ButtonBuilder().setCustomId("birthdate-btn").setLabel("✅ Accepter le règlement").setStyle(ButtonStyle.Success);
		await message.channel.send({
			content: `Après avoir lu le règlement **en entier**, veuillez cliquer sur le bouton ci-dessous pour accepter le règlement.\nDans une optique de sécurité, nous vous demanderons votre __date de naissance__. Le role correspondant à votre âge vous sera automatique ajouté.`,
			components: [new ActionRowBuilder().addComponents([button])]
		});
	},
};