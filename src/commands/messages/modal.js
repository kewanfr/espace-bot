const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits,
} = require("discord.js");

const command = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId("birthdate-modal")
    .setTitle("Votre date de naissance")
    .setDescription(
      "Pour connaitre votre âge, nous devons connaitre votre date de naissance.\nCelle-ci ne sera pas visible par les autres membres du serveur."
    )
    .setColor("#00ff00");

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
  help: {
    name: "modal",
    description: "Envoie le msg de modal",
    slash: true,
    category: "messages",
    deletemsg: true,
  },
  slash: [
    {
      name: "modal",
      description: "Renvoie un modal",
      default_member_permissions: "Administrator",
    },
  ],
  runSlash: async (client, interaction) => {
    command(interaction);
  },
};
