const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require('discord.js');
const { mps } = require('../../utils/infos');

function buildOptions(menu, options){
	let menuOptions = [];
	for (const o in options) {
		let option = options[o];
		let data = {
			label: `${option.name}`,
			value: `${option.rid}`,
		};
		if(option.emoji) data.emoji = option.emoji;
		menuOptions.push(new SelectMenuOptionBuilder(data));
	};

	menu.addOptions(menuOptions);
	return menu
}

module.exports = {
	help: {
		name: "roles2-msg",
		description: "Envoie le msg du salon roles2",
		slash: false,
		category: "messages",
		aliases: ["roles2-msg"],
		usage: "roles2-msg",
		cooldown: 5,
		permission: "Administrator",
		deletemsg: true,
	},
	run: async(client, message, args) => {

		let MPMenu = new SelectMenuBuilder()
		.setCustomId("choose-mps")
		.setMinValues(1)
		.setMaxValues(1)
		.setPlaceholder("📥 MP Ouverts ?");

		MPMenu = await buildOptions(MPMenu, mps);
		
		await message.channel.send({
			components: [new ActionRowBuilder().addComponents([MPMenu])]
		});
	},
};