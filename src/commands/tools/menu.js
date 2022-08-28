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
  name: "menu",
  description: "Renvoie un menu",
  type: ["cmd"],
  build: new SlashCommandBuilder()
    .setName("menu")
    .setDescription("Renvoie un menu"),
  deletemsg: true,

  run: async (client, message, args) => {
    await message.channel.send(command());
  },
  runSlash: async (client, interaction) => {
    await interaction.reply(command());
  },
};