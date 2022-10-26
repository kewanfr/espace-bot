const { ButtonBuilder, ButtonStyle, ActionRowBuilder, SelectMenuOptionBuilder, SelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	help: {
		name: "soutien-msg",
		description: "Envoie le msg du salon soutien",
		slash: false,
		category: "messages",
		aliases: ["soutien-msg"],
		usage: "soutien-msg",
		cooldown: 5,
		permission: "Administrator",
		deletemsg: true,
	},
	dev: true,
	run: async(client, message, args) => {
		const Embed = new EmbedBuilder()
			.setTitle("Soutien moral et psychologique")
			.setAuthor({name: `${message.guild.name}`, iconURL: message.guild.iconURL()})
			.setDescription(
`Salut ! Tu sens mal ? Tu a besoin de parler ? Ou autre ? Je t'invite donc à cliquer ci-dessous tu sera dirigé vers des personnes prêts à t'aider !`)
.setColor('Blurple');

		const Buttons = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId("soutien-moral-btn")
				.setLabel("Soutien moral")
				.setStyle(ButtonStyle.Primary)
				.setEmoji('🤝'),
		);

		await message.channel.send({
			embeds: [Embed],
			components: [Buttons]
		});
	},
};