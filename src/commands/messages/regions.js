const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require('discord.js');
const { departementsByRegions } = require('../../utils/infos');

module.exports = {
	name: "regions",
	description: "Régions",
	type: ["cmd"],
	deletemsg: true,

	run: async(client, message, args) => {

		const menu = new SelectMenuBuilder()
		.setCustomId("choose-region")
		.setMinValues(1)
		.setMaxValues(1)
		.setPlaceholder("Choisissez votre région")


		for (const r in departementsByRegions) {
			let region = departementsByRegions[r];
			menu.addOptions(new SelectMenuOptionBuilder({
        label: `${region.name}`,
        value: `${region.rid}`,
				emoji: `${region.emoji}`,
      }));
		}

		await message.channel.send({
			content: `Choisissez votre région`,
			components: [new ActionRowBuilder().addComponents([menu])]
		});
	},
};