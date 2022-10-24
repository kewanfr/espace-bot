const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ModalSubmitInteraction,
  userMention,
} = require("discord.js");
const { departementsByRegions } = require("../../utils/infos");

module.exports = {
  data: {
    name: "rencontres",
    modals: ["recherche-modal"],
    buttons: ["recherche-btn"],
  },
  /**
   * 
   * @param {*} client 
   * @param {ModalSubmitInteraction} interaction 
   */
  async execute(client, interaction) {
    let { customId, guild, member, channel } = interaction;

    let rechercheChannel = interaction.guild.channels.cache.get(
      client.config.channels.recherche
    );

    if (customId === "recherche-btn") {
      const modal = new ModalBuilder()
        .setCustomId("recherche-modal")
        .setTitle("Rencontres");

      const recherche = new TextInputBuilder()
        .setCustomId("recherche")
        .setLabel("Recherche")
        .setPlaceholder("Ce que je recherche")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(recherche));

      await interaction.showModal(modal);
    }else if(customId === "recherche-modal"){
      let recherche = interaction.fields.getTextInputValue("recherche");

      console.log(recherche);
      interaction.reply({content: `✅ Votre message a bien été envoyé !`, ephemeral: true});
      rechercheChannel.send(`
        ${userMention(member.user.id)} recherche:\n${recherche}
      `)
    }
  },
};
