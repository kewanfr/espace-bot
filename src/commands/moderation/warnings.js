const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  userMention,
} = require("discord.js");
const { warnsModel } = require("../../schemas");

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
    const Reason = interaction.options.getString("raison");
    const Severity = interaction.options.getString("niveau") || 1;
    const WarnId = interaction.options.getNumber("id") - 1;
    const WarnDate = new Date(
      interaction.createdTimestamp
    ).toLocaleDateString();

    if (Sub === "add") {
      let data = await warnsModel
        .findOne({ userID: Target.id, guildID: interaction.guild.id })
        .catch(console.error);

      if (!data) {
        data = new warnsModel({
          guildID: interaction.guild.id,
          userID: Target.id,
          userTag: Target.tag,
          content: [
            {
              executorID: interaction.user.id,
              executorTag: interaction.user.tag,
              reason: Reason,
              type: "warn",
              date: WarnDate,
              severity: Severity,
            },
          ],
        });
      } else {
        const obj = {
          executorID: interaction.user.id,
          executorTag: interaction.user.tag,
          reason: Reason,
          type: "warn",
          date: WarnDate,
          severity: Severity,
        };
        data.content.push(obj);
      }
      data.save();

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Avertissement`)
            .setColor("Blurple")
            .setDescription(
              `${userMention(Target.id)} a été averti\n**Raison**: ${Reason}\n**Gravité**: ${Severity}\n**Averti par**: ${userMention(interaction.user.id)}\n**Date**: ${WarnDate}`
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
            `${data.content
              .map(
                (w, i) =>
                  `**ID**: ${i + 1}\n**Averti par**: ${userMention(
                    w.executorID
                  )}\n**Date**: ${w.date}\n**Raison**: ${w.reason}\n**Gravité**: ${w.severity}\n\n`
              )
              .join(" ")}`
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
                  `L'avertissement #${WarnId + 1} de ${userMention(Target.id)} a été supprimé\n${data.content.map((w, i) => `**ID**: ${i + 1}\n**Averti par**: ${userMention(w.executorID)}\n**Date**: ${w.date}\n**Raison**: ${w.reason}\n**Gravité**: ${w.severity}\n\n`).join(" ")}`
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
                  Liste des avertissements:\n${data.content.map((w, i) => `**ID**: ${i + 1}\n**Averti par**: ${userMention(w.executorID)}\n**Date**: ${w.date}\n**Raison**: ${w.reason}\n**Gravité**: ${w.severity}\n\n`).join(" ")}`),
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
