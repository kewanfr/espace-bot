const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  AttachmentBuilder
} = require("discord.js");
const {
  getPresentationDb, getPresentation, setPresentation
} = require("../../utils/functions/presentationFunctions");
const { departementsByRegions } = require("../../utils/infos");

module.exports = {
  data: {
    name: "presentations",
    modals: ["presentation-modal", "social-network-modal"],
    buttons: [
      "cancel-presentation",
      "edit-presentation",
      "delete-presentation",
      "save-presentation",
      "add-social-presentation",
    ],
  },
  async execute(client, interaction) {
    let { customId, guild, member, channel } = interaction;

    if(customId === "presentation-modal") {
      let result = {};
      var dbResult = [];
      interaction.fields.fields.forEach((field) => {
        result[field.customId] = field.value;
        dbResult.push({ key: field.customId, result: field.value });
      });
      client.setUserInfo(interaction.member, interaction.guild, dbResult);

      let presentationDb = await setPresentation(client, interaction, result);

      let presentation = await getPresentation(client, interaction);

      presentation += `\nVoici à quoi ressemble votre présentation. Elle sera visible par tous dans ce salon, ainsi que sur votre profile.\nSouhaitez-vous la publier ?`;

      let submitButton = new ButtonBuilder()
        .setCustomId("save-presentation")
        .setLabel("💾 Enregistrer")
        .setStyle(ButtonStyle.Success);
      let socialButton = new ButtonBuilder()
        .setCustomId("add-social-presentation")
        .setLabel("Ajouter mes Réseaux sociaux")
        .setStyle(ButtonStyle.Primary);
      let editButton = new ButtonBuilder()
        .setCustomId("edit-presentation")
        .setLabel("✏ Editer")
        .setStyle(ButtonStyle.Secondary);

      interaction.reply({
        content: presentation,
        components: [
          new ActionRowBuilder().addComponents(
            submitButton,
            socialButton,
            editButton
          ),
        ],
        ephemeral: true,
      });
    }else if(customId === "social-network-modal"){
      let dbUser = await client.getUserInfos(interaction.member, interaction.guild);

      let result = {};
      interaction.fields.fields.forEach(field => {
        result[field.customId] = field.value;
      });

      let presentationDb = await setPresentation(client, interaction, result);

      let presentation = await getPresentation(client, interaction);

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
    } else {
      let presentationChannel = interaction.guild.channels.cache.get(
        client.config.channels.presentation
      );

      let presentationDb = await getPresentationDb(client, interaction);
      switch (customId) {
        case "cancel-presentation":
          await setPresentation(client, interaction, { status: "cancelled" });
          interaction.message.delete();
          break;
          
        case "edit-presentation":
          let dbUser = await client.getUserInfos(interaction.member, interaction.guild);
          let region = departementsByRegions[dbUser.region];
          const modal = new ModalBuilder()
            .setCustomId("presentation-modal")
            .setTitle("Présentation");

          const Prenom = new TextInputBuilder()
            .setCustomId("prenom")
            .setLabel("Prénom/Pseudo")
            .setPlaceholder("Prénom ou pseudo")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const Localisation = new TextInputBuilder()
            .setCustomId("localisation")
            .setLabel("Département/Ville(s)")
            .setPlaceholder(region.name)
            .setStyle(TextInputStyle.Short)
            .setRequired(false);
          
          const physique = new TextInputBuilder()
            .setCustomId("desc_physique")
            .setLabel("Description Physique")
            .setPlaceholder("Description physique")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);
          
          const hobby = new TextInputBuilder()
            .setCustomId("hobbies")
            .setLabel("Mes hobbies/Passions")
            .setPlaceholder("Mes hobbies/Passions")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);
          
          const infos = new TextInputBuilder()
            .setCustomId("desc_perso")
            .setLabel("Plus d'infos sur moi")
            .setPlaceholder("Plus d'infos sur moi")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

          if(presentationDb.prenom) Prenom.setValue(presentationDb.prenom);
          if(presentationDb.localisation) Localisation.setValue(presentationDb.localisation);
          if(presentationDb.desc_physique) physique.setValue(presentationDb.desc_physique);
          if(presentationDb.hobbies) hobby.setValue(presentationDb.hobbies);
          if(presentationDb.desc_perso) infos.setValue(presentationDb.desc_perso);
          

          modal.addComponents(new ActionRowBuilder().addComponents(Prenom), new ActionRowBuilder().addComponents(Localisation), new ActionRowBuilder().addComponents(physique), new ActionRowBuilder().addComponents(hobby), new ActionRowBuilder().addComponents(infos));

          await interaction.showModal(modal);
          break;

        case "delete-presentation":
          if (presentationDb.messageId) {
            await (
              await presentationChannel.messages.fetch(presentationDb.messageId)
            ).delete();
            interaction.reply({
              content: "🗑 Présentation Supprimée !",
              ephemeral: true,
            });
            presentationDb = await setPresentation(client, interaction, {
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
          let presentation = await getPresentation(client, interaction);

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
            await setPresentation(client, interaction, {
              messageId: message.id,
            });
          }
          presentationDb = await setPresentation(client, interaction, {
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

          if (presentationDb.instagram)
            instagram.setValue(presentationDb.instagram);
          if (presentationDb.snapchat)
            snapchat.setValue(presentationDb.snapchat);
          if (presentationDb.twitter) twitter.setValue(presentationDb.twitter);

          socialNetworkModal.addComponents(
            new ActionRowBuilder().addComponents(instagram),
            new ActionRowBuilder().addComponents(snapchat),
            new ActionRowBuilder().addComponents(twitter)
          );

          await interaction.showModal(socialNetworkModal);
          break;

        default:
          break;
      }
    }
  },
};
