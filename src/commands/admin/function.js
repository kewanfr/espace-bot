module.exports = {
	help: {
		name: "function",
		description: "function",
		slash: false,
		category: "admin",
		aliases: ["function"],
		usage: "function",
		cooldown: 5,
		permission: "Administrator",
		deletemsg: true,
	},
	run: async(client, message, args) => {

		// set Permission to all channels in a category

		// const channels = message.guild.channels.fetch();

		// message.guild.channels.cache.filter(channel => channel.name === "𝑃𝑙𝑢𝑠").forEach(channel => {
		// 	channel.setName("𝑄𝑢𝑒𝑒𝑟+");
		// });

		// let category = "1011365866362916914";
		// let roleId = "1011725018432032809";
		// message.guild.channels.cache
		// .filter((c) => c.parentId === category)
		// .forEach((c) => {
		// 	c.edit({
		// 		permissionOverwrites: [
		// 			{
		// 				id: message.guild.id,
		// 				deny: [
		// 					PermissionsBitField.Flags.ViewChannel,
		// 					PermissionsBitField.Flags.SendMessages,
		// 				],
		// 			},
		// 			{
		// 				id: roleId,
		// 				allow: [
		// 					PermissionsBitField.Flags.ViewChannel,
		// 					PermissionsBitField.Flags.SendMessages,
		// 				],
		// 			},
		// 		],
		// 		reason: "update",
		// 	});
		// });
	},
};