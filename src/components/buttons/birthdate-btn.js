const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

module.exports = {
  data: {
    name: 'birthdate-btn',
  },
  async execute(client, interaction) {
    const modal = new ModalBuilder()
    .setCustomId("birthdate")
    .setTitle("Votre date de naissance")

    const textInput = new TextInputBuilder()
    .setCustomId("birthdateInput")
    .setLabel("Date de naissance")
    .setPlaceholder("JJ/MM/AAAA")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents([textInput]));

    await interaction.showModal(modal);
  }
}