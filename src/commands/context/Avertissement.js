const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  AttachmentBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  userMention,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { warnsModel } = require("../../schemas");
const { returnWarns } = require("../../utils/functions/warnsFunctions");

module.exports = {
  help: {
    name: "Avertissement",
    description: "Avertir un utilisateur",
    slash: "context",
    context: true,
  },
  slash: [
    {
      name: "Avertissement",
      type: ApplicationCommandType.Message,
      default_member_permissions: "KickMembers",
    },
    {
      name: "Avertissement ",
      type: ApplicationCommandType.User,
      default_member_permissions: "KickMembers",
    },
  ],
  runContextMenu: async (client, interaction) => {
    let targetMember;
    let guildID = interaction.guildId;
    let member = interaction.member;
    let channel = interaction.member.guild.channels.cache.get(
      interaction.channelId
    );
    if (interaction.commandType == ApplicationCommandType.Message) {
      let message = await channel.messages.fetch(interaction.targetId);
      if (message)
        targetMember = await interaction.member.guild.members.fetch(
          message.author.id
        );
    } else if (interaction.commandType == ApplicationCommandType.User) {
      targetMember = await interaction.member.guild.members.fetch(
        interaction.targetId
      );
    }
    if(!targetMember) return interaction.reply({content: "Impossible de trouver l'utilisateur", ephemeral: true});
    if(targetMember.id == member.id) return interaction.reply({content: "Vous ne pouvez pas vous avertir vous-même", ephemeral: true});
    if(targetMember.id == client.user.id) return interaction.reply({content: "Vous ne pouvez pas m'avertir", ephemeral: true});
    if(targetMember.roles.highest.position >= member.roles.highest.position) return interaction.reply({content: "Vous ne pouvez pas avertir cet utilisateur", ephemeral: true});

    let data = await warnsModel
      .findOne({ userID: targetMember.id, guildID: guildID })
      .catch(console.error);

    const menu = 
      new SelectMenuBuilder()
        .setCustomId(`warn-user-{id}${targetMember.id}`)
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder("Raison de l'avertissement");

    menu.addOptions(
      {
        label: "Spam (1)",
        value: "spam",
        emoji: "📢",
      },
      {
        label: "Publicité (1)",
        value: "publicite",
        emoji: "📢",
      },
      {
        label: "Demande de nude (3)",
        value: "demande_nude",
        emoji: "🔞",
      },
      {
        label: "Insultes (3)",
        value: "insultes",
        emoji: "🤬",
      },
      {
        label: "Autre",
        value: "autre",
        emoji: "❓",
      }
    );

    if (!data) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Avertissement de ${targetMember.tag}`)
            .setColor("Blurple")
            .setDescription(
              `${userMention(
                targetMember.id
              )} n'a aucun avertissement\nPour avertir cet utilisateur, choisissez la raison ci-dessous`
            ),
        ],
        components: [new ActionRowBuilder().addComponents(menu)],
        ephemeral: true,
      });
    } else {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Avertissements de ${targetMember.tag}`)
            .setColor("Blurple")
            .setDescription(
              `Voici les avertissements de ${userMention(targetMember.id)}:\n
            ${await returnWarns(data.content)}Pour avertir cet utilisateur, choisissez la raison ci-dessous`
            ),
        ],
        components: [new ActionRowBuilder().addComponents(menu)],
        ephemeral: true,
      });
    }

    // interaction.reply({embeds, ephemeral: true});
  },
};
