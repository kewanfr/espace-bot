const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  userMention,
} = require("discord.js");

module.exports = {
  data: {
    name: "soutien-moral",
    buttons: ["soutien-moral-btn", "soutien-close-"],
    modals: ["soutien-moral-modal"],
  },
  async execute(client, interaction) {
    let { customId, guild, member, channel } = interaction;
    console.log(customId)
    if (customId === "soutien-moral-btn") {
      const modal = new ModalBuilder()
        .setCustomId("soutien-moral-modal")
        .setTitle("Soutien moral");

      const textInput = new TextInputBuilder()
        .setCustomId("description")
        .setLabel("Description")
        .setPlaceholder("Décrivez votre problème")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents([textInput]));

      await interaction.showModal(modal);
    } else if (customId === "soutien-moral-modal") {
      const { fields } = interaction;
      const description = fields.getTextInputValue("description");

      let ticketName = `soutien-${member.user.username}`;
      await guild.channels
        .create({
          name: ticketName,
          type: ChannelType.GuildText,
          parent: client.config.channels.soutien.parent,
          permissionOverwrites: [
            {
              id: member.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
              ],
            },
            {
              id: client.config.roles.tickets.psychologue,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageMessages,
              ],
            },
            {
              id: guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel],
            },
          ],
        })
        .then(async (channel) => {
          const Embed = new EmbedBuilder()
            .setAuthor({
              name: `${guild.name}`,
              iconURL: guild.iconURL(),
            })
            .setTitle(`🤝 Soutien - ${member.user.tag}`)
            .setDescription(`**Message**: ${description}\n\n`)
            .setColor("#767ACA");

          const Buttons = new ActionRowBuilder();
          Buttons.addComponents(
            new ButtonBuilder()
              .setCustomId(`soutien-close-{id}${channel.id}`)
              .setLabel("Fermer le ticket")
              .setStyle(ButtonStyle.Primary)
              .setEmoji("🚫")
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
    }else if(customId.startsWith("soutien-close")){
      const channelId = customId.split("{id}")[1];
      const channel = guild.channels.cache.get(channelId);

      if(!channel) return interaction.reply({content: "❌ Une erreur s'est produite", ephemeral: true});

      interaction.reply({
        embeds: [
          new EmbedBuilder().setAuthor({
            name: `${guild.name}`,
            iconURL: guild.iconURL(),
          }).setTitle(`🤝 Soutien - ${member.user.tag}`).setDescription(
            `🗑 Ticket fermé par ${userMention(member.id)}`
          ),
        ],
      });

      setTimeout(() => {
        channel.delete();
      }, 10 * 1000);

    }
  },
};
