const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits
} = require("discord.js");

const command = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("birthdate")
    .setTitle("Votre date de naissance")
    .setDescription("Pour connaitre votre âge, nous devons connaitre votre date de naissance.\nCelle-ci ne sera pas visible par les autres membres du serveur.")
    .setColor("#00ff00")

    const textInput = new TextInputBuilder()
    .setName("birthdateInput")
    .setLabel("Date de naissance")
    .setPlaceholder("JJ/MM/AAAA")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents([textInput]));

    await interaction.showModal(modal);
};

module.exports = {
  name: "modal",
  description: "Renvoie un modal",
  type: ["slash"],
  build: new SlashCommandBuilder()
    .setName("modal")
    .setDescription("Renvoie un modal")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  deletemsg: false,
  runSlash: async (client, interaction) => {
    command(interaction)
  },
};