const {
  ActionRowBuilder,
  TextInputStyle,
  TextInputBuilder,
  ModalBuilder,
  ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits
} = require("discord.js");

const ticketModel = require("../../schemas/ticketModel");
const { createTranscript } = require("discord-html-transcripts");
const { default: mongoose } = require("mongoose");

module.exports = {
  data: {
    name: "tickets",
    modals: [
      "ticket-modal-question",
      "ticket-modal-probleme",
      "ticket-modal-partenariat",
      "ticket-modal-autre",
    ],
    buttons: [
      "ticket-question",
      "ticket-probleme",
      "ticket-partenariat",
      "ticket-autre",
    ],
  },
  async execute(client, interaction) {
    let { customId, IntType, guild, member } = interaction;

    switch (IntType) {
      case "button":
        let typeBtn = customId.split("-")[1];

        const modal = new ModalBuilder()
          .setCustomId(`ticket-modal-${typeBtn}`)
          .setTitle(
            `Ouvrir un ticket ${typeBtn.charAt(0).toUpperCase() + typeBtn.slice(1)}`
          );

        const sujetInput = new TextInputBuilder()
          .setCustomId("sujet")
          .setLabel("Sujet")
          .setPlaceholder("Sujet du ticket")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const descriptionInput = new TextInputBuilder()
          .setCustomId("description")
          .setLabel("Votre problème")
          .setPlaceholder(
            "Afin de vous aider au mieux et gagner du temps, veuillez décrire votre problème"
          )
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents([sujetInput]),
          new ActionRowBuilder().addComponents([descriptionInput])
        );

        await interaction.showModal(modal);
        break;

      case "modal":
        let type = customId.split("-")[2];
        let sujet = interaction.fields.getTextInputValue("sujet");
        let description = interaction.fields.getTextInputValue("description");

        let ID = Math.floor(Math.random() * 90000) + 10000;
        let ticketName = `${type}-${member.user.username}-${ID}`;

        await guild.channels
          .create({
            name: ticketName,
            type: ChannelType.GuildText,
            parent: client.config.channels.tickets.parent,
            permissionOverwrites: [
              {
                id: member.id,
                allow: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.ReadMessageHistory,
                ],
              },
              {
                id: client.config.roles.tickets.staff,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages],
              },
              {
                id: guild.roles.everyone,
                deny: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.ReadMessageHistory,
                ],
              },
            ],
          })
          .then(async (channel) => {
            await ticketModel.create({
              _id: mongoose.Types.ObjectId(),
              guildID: guild.id,
              userID: member.id,
              ticketID: ID,
              channelID: channel.id,
              closed: false,
              locked: false,
              type: type,
              sujet: sujet,
              description: description,
            });

            const Embed = new EmbedBuilder()
              .setAuthor({
                name: `${guild.name} | Ticket: ${ID}`,
                iconURL: guild.iconURL(),
              })
              .setTitle(`🎫 Ticket - ${member.user.tag}`)
              .setDescription(
                `**Type**: ${type}\n**Sujet**: ${sujet}\n**Message**: ${description}\n\n`
              )
              .setFooter({
                text: `Les boutons ci-dessous sont uniquement pour le staff.`,
              })
              .setColor("#767ACA");

            const Buttons = new ActionRowBuilder();
            Buttons.addComponents(
              new ButtonBuilder()
                .setCustomId("ticket-saveandclose")
                .setLabel("Enregistrer et fermer le ticket")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("💾"),
              new ButtonBuilder()
                .setCustomId("ticket-close")
                .setLabel("Fermer le ticket")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("🚫"),
              new ButtonBuilder()
                .setCustomId("ticket-lock")
                .setLabel("Verrouiller le ticket")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🔒"),
              new ButtonBuilder()
                .setCustomId("ticket-unlock")
                .setLabel("Déverrouiller le ticket")
                .setStyle(ButtonStyle.Success)
                .setEmoji("🔓")
            );

            channel.send({ embeds: [Embed], components: [Buttons] });

            await channel
              .send({ content: `<@${member.id}> voici votre ticket` })
              .then((m) => {
                setTimeout(() => {
                  m.delete().catch(() => {});
                }, 2 * 5000);
              });

            interaction.reply({
              content: "Votre ticket a bien été créé: <#" + channel.id + ">",
              ephemeral: true,
            });
          });
        break;

      default:
        break;
    }
  },
};
