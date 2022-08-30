const {
  EmbedBuilder,
  userMention,
} = require("discord.js");
const { warnsModel } = require("../../schemas");
const { returnWarns, addWarn } = require("../../utils/functions/warnsFunctions");

module.exports = {
  help: {
    name: "warnings",
    description: "Système d'avertissements",
    slash: true,
    category: "moderation",
    cooldown: 5,
    permission: "ManageMessages",
    deletemsg: true,
  },
  slash: [
    {
      name: "warnings",
      description: "Système d'avertissements",
      default_member_permissions: "ManageMessages",
      options: [
        {
          name: "add",
          description: "Ajouter un avertissement à un utilisateur",
          type: 1,
          options: [
            {
              name: "user",
              description: "Utilisateur à avertir",
              type: 6,
              required: true,
            },
            {
              name: "type",
              description: "Type de l'avertissement",
              type: 3,
              required: true,
              choices: [
                {
                  name: "Spam",
                  value: "spam",
                },
                {
                  name: "Publicité",
                  value: "publicite",
                },
                {
                  name: "Demande de nude",
                  value: "demande_nude",
                },
                {
                  name: "Insultes",
                  value: "insultes",
                },
                {
                  name: "Autre",
                  value: "autre",
                }
              ],
            },
            {
              name: "raison",
              description: "Raison de l'avertissement",
              type: 3,
              required: true,
            },
            {
              name: "niveau",
              description: "Gravité de l'avertissement",
              type: 3,
              required: false,
              min_value: 1,
              max_value: 3,
            },
          ],
        },
        {
          name: "check",
          description: "Voir les avertissements d'un utilisateur",
          type: 1,
          options: [
            {
              name: "user",
              description: "Utilisateur à avertir",
              type: 6,
              required: true,
            },
          ],
        },
        {
          name: "remove",
          description: "Supprimer un avertissement d'un utilisateur",
          type: 1,
          options: [
            {
              name: "user",
              description: "Utilisateur à avertir",
              type: 6,
              required: true,
            },
            {
              name: "id",
              description: "ID de l'avertissement",
              type: 10,
              required: true,
            },
          ],
        },
        {
          name: "clear",
          description: "Supprimer tous les avertissements d'un utilisateur",
          type: 1,
          options: [
            {
              name: "user",
              description: "Utilisateur à avertir",
              type: 6,
              required: true,
            },
          ],
        },
      ],
    },
  ],
  runSlash: async (client, interaction) => {
    const Sub = interaction.options.getSubcommand([
      "add",
      "check",
      "remove",
      "clear",
    ]);
    const Target = interaction.options.getUser("user");
    const Type = interaction.options.getString("type") || "autre";
    const Reason = interaction.options.getString("raison");
    const Severity = interaction.options.getString("niveau") || 1;
    const WarnId = interaction.options.getNumber("id") - 1;
    const WarnDate = new Date(
      interaction.createdTimestamp
    ).toLocaleDateString();

    if (Sub === "add") {
      await addWarn(interaction, Target, Reason, Type, WarnDate, Severity);

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Avertissement`)
            .setColor("Blurple")
            .setDescription(
              `${userMention(Target.id)} a été averti\n**Type**: ${Type}\n**Raison**: ${Reason}\n**Gravité**: ${Severity}\n**Averti par**: ${userMention(interaction.user.id)}\n**Date**: ${WarnDate}`
            ),
        ],
      });
    } else if (Sub == "check") {
      let data = await warnsModel
        .findOne({ userID: Target.id, guildID: interaction.guild.id })
        .catch(console.error);

      if (data) {
        const embed = new EmbedBuilder()
          .setTitle(`Avertissements de ${Target.tag}`)
          .setColor("Blurple")
          .setDescription(
            `${await returnWarns(data.content)}`
          );

        interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Avertissement de ${Target.tag}`)
              .setColor("Blurple")
              .setDescription(
                `${userMention(Target.id)} n'a aucun avertissement`
              ),
          ],
          ephemeral: true,
        });
      }
    }else if(Sub == "remove"){
      let data = await warnsModel.findOne({ userID: Target.id, guildID: interaction.guild.id }).catch(console.error);

      if(data){
        if(data.content[WarnId]){
          data.content.splice(WarnId, 1);
          data.save();
          if(data.content.length == 0) data.delete();
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle(`Avertissement supprimé`)
                .setColor("Blurple")
                .setDescription(
                  `L'avertissement #${WarnId + 1} de ${userMention(Target.id)} a été supprimé\n${await returnWarns(data.content)}`
                ),
            ],
            ephemeral: true 
          });
        }else{
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle(`Avertissement introuvable`)
                .setColor("Blurple")
                .setDescription(
                  `L'avertissement #${WarnId + 1} de ${userMention(Target.id)} n'existe pas\n
                  Liste des avertissements:\n${await returnWarns(data.content)}`),
            ],
            ephemeral: true
          });
        }
      }else{
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Avertissements de ${Target.tag}`)
              .setColor("Blurple")
              .setDescription(
                `${userMention(Target.id)} n'a aucun avertissement`
              ),
          ],
          ephemeral: true
        });
      }
    }else if(Sub == "clear"){
      let data = await warnsModel.findOne({ userID: Target.id, guildID: interaction.guild.id }).catch(console.error);

      if(data){
        await warnsModel.findOneAndDelete({ userID: Target.id, guildID: interaction.guild.id }).catch(console.error);
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Avertissements supprimés`)
              .setColor("Blurple")
              .setDescription(
                `Les avertissements de ${userMention(Target.id)} ont été supprimés`
              ),
          ],
          ephemeral: true
        });
      }else {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Avertissements de ${Target.tag}`)
              .setColor("Blurple")
              .setDescription(
                `${userMention(Target.id)} n'a aucun avertissement`
              ),
          ],
          ephemeral: true
        });
      }
    }
  },
};
