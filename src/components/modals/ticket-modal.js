const { ActionRowBuilder, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { default: mongoose } = require("mongoose");
const ticketModel = require("../../schemas/ticketModel");

module.exports = {
  data: {
    name: "ticket-modal",
    ids: [
      "ticket-modal-question",
      "ticket-modal-probleme",
      "ticket-modal-partenariat",
      "ticket-modal-autre",
    ],
  },
  async execute(client, interaction) {
    let { customId, guild, member } = interaction;

    let type = customId.split("-")[2];
    let sujet = interaction.fields.getTextInputValue("sujet");
    let description = interaction.fields.getTextInputValue("description");



    let ID = Math.floor(Math.random() * 90000) + 10000;
    let ticketName = `${type}-${member.user.username}-${ID}`;

    await guild.channels.create({
      name: ticketName,
      type: ChannelType.GuildText,
      parent: client.config.channels.tickets.parent,
      permissionOverwrites: [
        {
          id: member.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
        },
        {
          id: guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
        },
      ]
    }).then(async (channel) => {
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
        .setAuthor({ name: `${guild.name} | Ticket: ${ID}`, iconURL: guild.iconURL() })
        .setTitle(`🎫 Ticket - ${member.user.tag}`)
        .setDescription(`**Type**: ${type}\n**Sujet**: ${sujet}\n**Message**: ${description}\n\n`)
        .setFooter({ text: `Les boutons ci-dessous sont uniquement pour le staff.`})
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
          .setEmoji("🔓"),
      );

      channel.send({embeds: [Embed], components: [Buttons]});

      await channel.send({ content: `<@${member.id}> voici votre ticket` }).then((m) => {
        setTimeout(() => {
          m.delete().catch(() => {});
        }, 2* 5000);
      });

      interaction.reply({
        content: "Votre ticket a bien été créé: <#" + channel.id + ">",
        ephemeral: true,
      })


    });
  },
};
