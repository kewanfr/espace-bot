const { ActionRowBuilder, TextInputStyle, TextInputBuilder, ModalBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "presentation-action",
    ids: [
      "cancel-presentation",
      "edit-presentation",
      "delete-presentation",
      "save-presentation",
      "add-social-presentation"
    ],
  },
  async execute(client, interaction) {
    let { customId } = interaction;

    let presentationChannel = interaction.guild.channels.cache.get(
      client.config.channels.presentation
    );

    let presentationDb = await client.getPresentationDb(interaction);

    switch (customId) {
      case "cancel-presentation":
        await client.setPresentation(interaction, { status: "cancelled" });
        interaction.message.delete();
        break;

      case "edit-presentation":
        require("../../utils/functions/presentationModal")(client, interaction);
        break;

      case "delete-presentation":
        
        if (presentationDb.messageId) {
          await (await presentationChannel.messages.fetch(presentationDb.messageId)).delete();
          interaction.reply({
            content: "🗑 Présentation Supprimée !",
            ephemeral: true,
          });
          presentationDb = await client.setPresentation(interaction, {
            status: "deleted",
            messageId: null,
          });
        } else {
          interaction.reply({
            content: "❌ Présentation dèjà supprimée !",
            ephemeral: true,
          });
        }
        break;

      case "save-presentation":
        
        let presentation = await client.getPresentation(interaction);

        let avatar = new AttachmentBuilder(
          interaction.user.displayAvatarURL({ format: "png", size: 1024 })
        );

        let msg = false;
        if (presentationDb.messageId)
          msg = await presentationChannel.messages.cache.get(
            presentationDb.messageId
          );
        if (msg) {
          await msg.edit({ content: presentation, files: [avatar] });
        } else {
          let message = await presentationChannel.send({
            content: presentation,
            // files: [avatar],
          });
          await client.setPresentation(interaction, { messageId: message.id });
        }
        presentationDb = await client.setPresentation(interaction, {
          status: "published",
        });

        interaction.reply({
          content: "💾 Présentation enregistrée !",
          ephemeral: true,
        });
        break;

      case "add-social-presentation":
        let socialNetworkModal = new ModalBuilder()
          .setCustomId("social-network-modal")
          .setTitle("Ajouter mes réseaux sociaux");
        
        let instagram = new TextInputBuilder()
          .setCustomId("instagram")
          .setLabel("Instagram")
          .setPlaceholder("@username")
          .setStyle(TextInputStyle.Short)
          .setRequired(false);

        let snapchat = new TextInputBuilder()
          .setCustomId("snapchat")
          .setLabel("Snap")
          .setPlaceholder("@username")
          .setStyle(TextInputStyle.Short)
          .setRequired(false);

        let twitter = new TextInputBuilder()
          .setCustomId("twitter")
          .setLabel("Twitter")
          .setPlaceholder("@username")
          .setStyle(TextInputStyle.Short)
          .setRequired(false);

        if(presentationDb.instagram) instagram.setValue(presentationDb.instagram);
        if(presentationDb.snapchat) snapchat.setValue(presentationDb.snapchat);
        if(presentationDb.twitter) twitter.setValue(presentationDb.twitter);
        
        socialNetworkModal.addComponents(new ActionRowBuilder().addComponents(instagram), new ActionRowBuilder().addComponents(snapchat), new ActionRowBuilder().addComponents(twitter));

        await interaction.showModal(socialNetworkModal);
        break;

      default:
        break;
    }
  },
};
