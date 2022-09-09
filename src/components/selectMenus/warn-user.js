const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, userMention } = require("discord.js");
const { addWarn } = require("../../utils/functions/warnsFunctions");

module.exports = {
  data: {
    name: 'warn-user-',
  },
  async execute(client, interaction) {

    var typeSeverity = {
      "spam": "1",
      "publicite": "1",
      "demande_nude": "3",
      "insultes": "3",
      "autre": "1",
    };
    const type = interaction.values[0];
    const userId = interaction.customId.split("{id}")[1];
    const targetMember = await interaction.member.guild.members.fetch(userId);
    const WarnDate = new Date(
      interaction.createdTimestamp
    ).toLocaleDateString();

    const modal = new ModalBuilder()
    .setCustomId("warn-usermodal")
    .setTitle(`Avertir ${targetMember.user.username} : ${type}`)

    const raisonInput = new TextInputBuilder()
    .setCustomId("raison")
    .setLabel("Raison de l'avertissement")
    .setPlaceholder("Raison")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

    const severityInput = new TextInputBuilder()
    .setCustomId("severity")
    .setLabel("Gravité (Entre 1 et 4)")
    .setPlaceholder("Gravité")
    .setStyle(TextInputStyle.Short)
    .setValue(typeSeverity[type] || "1")
    .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents([raisonInput]), new ActionRowBuilder().addComponents([severityInput]));

    await interaction.showModal(modal);


    interaction.awaitModalSubmit({
      time: 60000,
      filter: i => i.customId === "warn-usermodal",
    }).then(async (inte) => {
      const raison = inte.fields.getTextInputValue("raison");
      const severity = parseInt(inte.fields.getTextInputValue("severity"));
      if(severity > 4 || severity < 1) return inte.reply({content: "La gravité doit être comprise entre 1 et 4", ephemeral: true});
      await addWarn(inte, targetMember, raison, type, WarnDate, severity);

      await inte.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Avertissement`)
            .setColor("Blurple")
            .setDescription(
              `${userMention(targetMember.id)} a été averti\n**Type**: ${type}\n**Raison**: ${raison}\n**Gravité**: ${severity}\n**Averti par**: ${userMention(inte.user.id)}\n**Date**: ${WarnDate}`
            ),
        ],
      });
    }).catch(error => {
      // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
      console._error(error)
      return null;
    })

  }
}