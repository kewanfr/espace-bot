const {
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder
} = require("discord.js");

module.exports = {
  data: {
    name: 'social-network-modal',
  },
  async execute(client, interaction) {

    let dbUser = await client.getUserInfos(interaction.member, interaction.guild);

    let result = {};
    interaction.fields.fields.forEach(field => {
      result[field.customId] = field.value;
    });

    let presentationDb = await client.setPresentation(interaction, result);

    let presentation = await client.getPresentation(interaction);

    presentation += `\nVoici à quoi ressemble votre présentation. Elle sera visible par tous dans ce salon, ainsi que sur votre profile.\nSouhaitez-vous la publier ?`;

    let submitButton = new ButtonBuilder().setCustomId("save-presentation").setLabel("💾 Enregistrer").setStyle(ButtonStyle.Success)
    let socialButton = new ButtonBuilder().setCustomId("add-social-presentation").setLabel("Réseaux sociaux").setStyle(ButtonStyle.Primary)
    let editButton = new ButtonBuilder().setCustomId("edit-presentation").setLabel("✏ Editer").setStyle(ButtonStyle.Secondary)

    interaction.reply({
      content: presentation,
      components: [
        new ActionRowBuilder().addComponents(submitButton, socialButton, editButton)
      ],
      ephemeral: true
    })

  }
}