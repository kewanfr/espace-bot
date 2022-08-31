const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, roleMention } = require('discord.js');

module.exports = {
	help: {
		name: "verif-msg",
		description: "Envoie le msg de vérification de membre",
		slash: false,
		category: "messages",
		aliases: ["verif-msg"],
		usage: "verif-msg",
		cooldown: 5,
		permission: "Administrator",
		deletemsg: true,
	},
	run: async(client, message, args) => {


		const Embed = new EmbedBuilder()
			.setTitle("⭐ Membres vérifiés")
			.setAuthor({name: `${message.guild.name}`, iconURL: message.guild.iconURL()})
			.setDescription(
`Afin d'ajouter de la **sécurité** sur le serveur, nous mettons en place un __système de vérification__.\nPour obtenir la vérification, il vous faudra nous envoyer une photo de votre visage en tenant un papier qui contient un code unique. Une fois ceci fait, vous obtiendrez le role ${roleMention(client.config.roles.verified)} !\n\nNous vous __encourageons fortement__ à le faire. Cela vous permettra d'avoir accès à des salons **supplémentaires** !\nPour commencer la vérification, cliquez sur le bouton ci-dessous ⬇`) // message become verified member
.setColor('DarkGreen');

		const Buttons = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId("verif-member-btn")
				.setLabel("Commencer la vérification")
				.setStyle(ButtonStyle.Success)
				.setEmoji('⭐'),
		);

		await message.channel.send({
			embeds: [Embed],
			components: [Buttons]
		});
	},
};