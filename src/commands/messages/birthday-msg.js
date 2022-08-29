const { ButtonBuilder, ButtonStyle, ActionRowBuilder, SelectMenuOptionBuilder, SelectMenuBuilder } = require('discord.js');

module.exports = {
	help: {
		name: "birthday-msg",
		description: "Envoie le msg du salon anniversaire",
		slash: false,
		category: "messages",
		aliases: ["birthday-msg"],
		usage: "birthday-msg",
		cooldown: 5,
		permission: "Administrator",
		deletemsg: true,
	},
	run: async(client, message, args) => {
		let birthdayMenu = new SelectMenuBuilder()
		.setCustomId("choose-birthday-msg")
		.setMinValues(1)
		.setMaxValues(1)
		.setPlaceholder("🎂 Mon Anniversaire");

		birthdayMenu.addOptions([
			new SelectMenuOptionBuilder({
				label: `Oui, je souhaite recevoir un message chaque anniversaire`,
				value: `yes`,
				emoji: "✅"
			}),
			new SelectMenuOptionBuilder({
				label: `Non, je ne souhaite pas recevoir de message chaque anniversaire`,
				value: `no`,
				emoji: "❌"
			})
		])

		const birthdateButton = new ButtonBuilder().setCustomId("birthdate-btn").setLabel("👶 Modifier ma date de Naissance").setStyle(ButtonStyle.Primary);
		await message.channel.send({
			content: `Vous avez normalement dèjà renseigné votre date de naissance lors de la validation du règlement. Si ce n'est pas le cas, vous pouvez le faire en cliquant sur le boutton ci-dessous.\nVous pouvez également choisir si vous souhaitez que le bot vous souhaite un joyeux anniversaire **automatiquement chaque année**.\nCe message sera envoyé dans ce salon et __visible par tous__ les membres du serveur.`,
			components: [new ActionRowBuilder().addComponents([birthdayMenu]), new ActionRowBuilder().addComponents([birthdateButton])]
		});
	},
};