const { ActionRowBuilder, TextInputStyle, TextInputBuilder, ModalBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "create-ticket",
    ids: [
      "ticket-question",
      "ticket-probleme",
      "ticket-partenariat",
      "ticket-autre",
    ],
  },
  async execute(client, interaction) {
    let { customId, guild, member } = interaction;

    let type = customId.split("-")[1];

    const modal = new ModalBuilder()
    .setCustomId(`ticket-modal-${type}`)
    .setTitle(`Ouvrir un ticket ${type.charAt(0).toUpperCase() + type.slice(1)}`)

    const sujet = new TextInputBuilder()
    .setCustomId("sujet")
    .setLabel("Sujet")
    .setPlaceholder("Sujet du ticket")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    const description = new TextInputBuilder()
    .setCustomId("description")
    .setLabel("Votre problème")
    .setPlaceholder("Afin de vous aider au mieux et gagner du temps, veuillez décrire votre problème")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents([sujet]), new ActionRowBuilder().addComponents([description]));
    
    await interaction.showModal(modal);
  },
};
