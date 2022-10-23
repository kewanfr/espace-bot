const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require('discord.js');
const { departementsByRegions, orientations, genres, pronoms, statut, recherche } = require('../../utils/infos');

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
		name: "roles-msg",
		description: "Envoie le msg du salon roles",
		slash: false,
		category: "messages",
		aliases: ["roles-msg"],
		usage: "roles-msg",
		cooldown: 5,
		permission: "Administrator",
		deletemsg: true,
	},
	run: async(client, message, args) => {

		let orientationMenu = new SelectMenuBuilder()
		.setCustomId("choose-orientation")
		.setMinValues(1)
		.setMaxValues(2)
		.setPlaceholder("🧭 Mon Orientation");

		orientationMenu = await buildOptions(orientationMenu, orientations);

		let genderMenu = new SelectMenuBuilder()
		.setCustomId("choose-gender")
		.setMinValues(1)
		.setMaxValues(3)
		.setPlaceholder("🧠 Mon Genre");

		genderMenu = await buildOptions(genderMenu, genres);

		let pronomsMenu = new SelectMenuBuilder()
		.setCustomId("choose-pronoms")
		.setMinValues(1)
		.setMaxValues(3)
		.setPlaceholder("👤 Mes Pronoms");

		pronomsMenu = await buildOptions(pronomsMenu, pronoms);

		let statutMenu = new SelectMenuBuilder()
		.setCustomId("choose-statut")
		.setMinValues(1)
		.setMaxValues(2)
		.setPlaceholder("💗 Mon Statut");

		statutMenu = await buildOptions(statutMenu, statut);

		let rechercheMenu = new SelectMenuBuilder()
		.setCustomId("choose-search")
		.setMinValues(1)
		.setMaxValues(4)
		.setPlaceholder("🔍 Je recherche");

		rechercheMenu = await buildOptions(rechercheMenu, recherche);

		let regionMenu = new SelectMenuBuilder()
		.setCustomId("choose-region")
		.setMinValues(1)
		.setMaxValues(3)
		.setPlaceholder("📍 Ma région");

		regionMenu = await buildOptions(regionMenu, departementsByRegions);
		
		await message.channel.send({
			content: `
Vous avez la possibilité de choisir vos roles.
Ces roles seront affichés sur votre profil et permettront aux membres d'en savoir un peu plus sur vous.
Vous pouvez en choisir __autant__ que vous le __souhaitez__. Vous __pouvez__ aussi choisir de **__ne pas avoir__** de role.

Certains roles vont sont automatiquement attribués, en fonction de ce que vous avez renseigné.
C'est par exemple le cas de l'**__age__**, que vous avez renseigné pour rentrer sur le serveur, qui est attribué **automatiquement** __tout les ans__.
`,
			components: [new ActionRowBuilder().addComponents([orientationMenu]), new ActionRowBuilder().addComponents([genderMenu]), new ActionRowBuilder().addComponents([pronomsMenu]), new ActionRowBuilder().addComponents([statutMenu]), new ActionRowBuilder().addComponents([rechercheMenu])]
		});

		await message.channel.send({
			content: `Afin d'acceder aux salons de votre région, merci de choisir votre région`,
			components: [new ActionRowBuilder().addComponents([regionMenu])]
		});
	},
};