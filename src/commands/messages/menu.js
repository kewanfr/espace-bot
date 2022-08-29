const {
  SlashCommandBuilder,
  SelectMenuBuilder,
  ActionRowBuilder,
  SelectMenuOptionBuilder,
} = require("discord.js");

const command = () => {
  const menu = new SelectMenuBuilder()
    .setCustomId("sub-menu")
    .setMinValues(1)
    .setMaxValues(1)
    .setOptions(
      new SelectMenuOptionBuilder({
        label: "Option #1",
        value: "1",
      }),
      new SelectMenuOptionBuilder({
        label: "Option #2",
        value: "2",
      })
    );

  return {
    components: [new ActionRowBuilder().addComponents([menu])],
  };
};

module.exports = {
	help: {
		name: "menu",
		description: "Envoie un menu",
		slash: false,
		category: "messages",
		aliases: ["menu-msg"],
		usage: "menu-msg",
		cooldown: 5,
		permission: "Administrator",
		deletemsg: true,
	},
  run: async (client, message, args) => {
    await message.channel.send(command());
  },
};