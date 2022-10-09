const { ButtonBuilder, ButtonStyle, ActionRowBuilder, SelectMenuOptionBuilder, SelectMenuBuilder, userMention } = require('discord.js');

module.exports = {
	help: {
		name: "event-msg",
		description: "Envoie le msg event",
		slash: false,
		category: "messages",
		aliases: ["event-msg"],
		usage: "event-msg",
		cooldown: 5,
		permission: "Administrator",
		deletemsg: true,
	},
	run: async(client, message, args) => {
		let menuChoose = new SelectMenuBuilder()
		.setCustomId("participate-event")
		.setMinValues(1)
		.setMaxValues(1)
		.setPlaceholder("Participer à l'évènement");

		menuChoose.addOptions([
			new SelectMenuOptionBuilder({
				label: `Oui, je souhaite participer à l'évènement`,
				value: `yes`,
				emoji: "✅"
			}),
			new SelectMenuOptionBuilder({
				label: `Non, je ne souhaite pas participer à l'évènement`,
				value: `no`,
				emoji: "❌"
			})
		])

		await message.channel.send({
			content: `Bonjour a tous, 
Une soirée mini jeu aura lieu le Samedi 15 octobre à 21h. Merci de signaler votre présence ci-dessous, si vous ne le faite pas vous ne pourrez pas participer à la soirée mais avant d'interagir assurez vous de bien être présent ce jour ci.
Cet évènement sera réalisé par ${userMention("827203763885834301")} si vous avez des questions ou des problème n'hésitez pas a aller le dm. 

Bonne fin d'après midi a tous`,
			components: [new ActionRowBuilder().addComponents([menuChoose])]
		});
	},
};