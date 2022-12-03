const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalSubmitInteraction,
  ChannelType,
  userMention,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  PermissionFlagsBits,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
} = require("discord.js");
// const { createTranscript } = require("discord-html-transcripts");
const verifModel = require("../../schemas/verifModel");

module.exports = {
  data: {
    name: "verif-member",
    buttons: ["verif-member-btn", "verif-member-btn2"],
    modals: ["verif-member-modal"],
    selectMenus: ["verif-menu-"],
  },
  async execute(client, interaction) {
    let { customId, guild, member, channel } = interaction;

    if (customId === "verif-member-btn") {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("⭐ Vérification")
            .setDescription(
              "Pour continuer la vérification, vous devrez nous confirmer votre **prénom** ainsi que **votre date de naissance** (ces informations ne seront __pas partagés__)."
            )
            .setColor("Aqua"),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("Continuer")
              .setStyle(ButtonStyle.Primary)
              .setCustomId("verif-member-btn2")
          ),
        ],
        ephemeral: true,
      });
    } else if (customId === "verif-member-btn2") {
      const modal = new ModalBuilder()
        .setCustomId(`verif-member-modal`)
        .setTitle(`⭐ Vérification`);

      const prenom = new TextInputBuilder()
        .setCustomId("prenom")
        .setLabel("Prénom")
        .setPlaceholder("Votre prénom")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const birthdateInput = new TextInputBuilder()
        .setCustomId("birthdate")
        .setLabel("Date de naissance")
        .setPlaceholder("Format : JJ/MM/AAAA (exemple : 01/12/2000)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents([prenom]),
        new ActionRowBuilder().addComponents([birthdateInput])
      );

      await interaction.showModal(modal);
    } else if (customId === "verif-member-modal") {
      const { BirthdateModel, UserModel, mongoose } = client;
      const { fields, member } = interaction;

      const prenom = fields.getTextInputValue("prenom");
      const birthdate = fields.getTextInputValue("birthdate");

      if (!client.testBirthdate(birthdate)) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("⭐ Vérification")
              .setDescription(
                "La date de naissance que vous avez entré n'est pas valide. Veuillez réessayer."
              )
              .setColor("Red"),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Continuer")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("verif-member-btn2")
            ),
          ],
          ephemeral: true,
        });
      }

      const date = birthdate.split("/");
      const age = await client.getAgeFromDate(
        new Date(`${date[1]}-${date[0]}-${date[2]}`)
      );
      await client.setBirthdate(interaction, date[0], date[1], date[2], age);
      await client.setPrenom(interaction, prenom);

      const ticketName = `verification-${member.user.username}`;

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
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
              ],
            },
            {
              id: client.config.roles.tickets.staff,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageMessages,
              ],
            },
            {
              id: guild.roles.everyone,
              deny: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
              ],
            },
          ],
        })
        .then(async (chann) => {
          const token = client.generateNumber(6);

          let verifMenu = new SelectMenuBuilder()
            .setCustomId(`verif-menu-{id}${member.user.id}`)
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder("Vérification");

          verifMenu.addOptions([
            new SelectMenuOptionBuilder({
              label: `Valider la vérification`,
              value: `yes`,
              emoji: "✅",
            }),
            new SelectMenuOptionBuilder({
              label: `Refuser la vérification`,
              value: `no`,
              emoji: "❌",
            }),
            new SelectMenuOptionBuilder({
              label: `Supprimer le salon, autre raison`,
              value: `delete`,
              emoji: "🗑",
            }),
          ]);

          await verifModel.create({
            _id: mongoose.Types.ObjectId(),
            userID: member.id,
            guildID: guild.id,
            channelID: chann.id,
            token: token,
            status: "open",
            prenom: prenom,
            birthdate: birthdate,
          });

          await chann.send({
            content: userMention(member.user.id),
            embeds: [
              new EmbedBuilder()
                .setTitle(`⭐ Vérification ${member.user.tag}`)
                .setDescription(
                  `**Utilisateur**: ${userMention(
                    member.user.id
                  )}\n**Prénom**: ${prenom}\n**Date de naissance**: ${birthdate}\n**Age**: ${age} ans\n**Token**: ${token}`
                )
                .setColor("Aqua"),
              new EmbedBuilder()
                .setDescription(
                  `Pour procéder à la vérification, veuillez suivre les instructions ci-dessous:\n\n1. Inscris **__${token}__** sur une morceau de papier\n2. Prends en photo ton visage, en montrant CLAIREMENT le morceau de papier\n3. Envoie la photo dans ce salon\n\nUn membre du staff te répondra dans les plus brefs délais, afin de valider votre vérification. Merci de votre compréhension.\nUne fois la vérification terminée, votre photo sera supprimée\n\n*Si vous avez besoin d'aide, envoyez un message dans ce salon.*`
                )
                .setColor("Aqua"),
            ],
            components: [new ActionRowBuilder().addComponents(verifMenu)],
          });

          console.log(`[VERIF] ${member.user.tag} a créé un ticket de vérification`);

          interaction.reply({
            content: "Votre ticket a bien été créé: <#" + chann.id + ">",
            ephemeral: true,
          });
        });
    } else if (customId.startsWith("verif-menu-")) {
      const userId = customId.split("{id}")[1];
      const targetMember = await guild.members.fetch(userId);
      const action = interaction.values[0];

      if (!member.permissions.has(PermissionFlagsBits.ManageMessages))
        return interaction.reply({
          content: "❌ Seul le staff peut utiliser ces boutons",
          ephemeral: true,
        });

      if (action === "yes") {
        console.log(`[VERIF] ${targetMember.user.tag} a été vérifié`);
        await client.setUserInfo(targetMember, guild, [
          { key: "verified", value: true },
        ]);
        await targetMember.roles.add(client.config.roles.verified);
        await verifModel.updateOne(
          { channelID: channel.id },
          { status: "verified" }
        );
        let userDb = await verifModel.findOne(
          { channelID: channel.id },
        );

        await interaction.reply({
          content: `✅ ${userMention(
            targetMember.id
          )} votre vérification a été validée !\nCe salon sera supprimé dans les prochaines minutes.`,
        });
        await targetMember.send({
          content: `✅ ${userMention(
            targetMember.id
          )} votre vérification a été validée sur \`${
            interaction.guild.name
          }\` !\nVous êtes désormais **Membre vérifié**.`,
        });

        // const attachment = await createTranscript(channel, {
        //   limit: -1,
        //   returnBuffer: false,
        //   fileName: `verif${targetMember.user.tag}.html`,
        // });

        setTimeout(() => {
          interaction.channel.delete();
        }, 15 * 3600);

        const Message = await guild.channels.cache
          .get(client.config.channels.tickets.transcript)
          .send({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: targetMember.user.tag,
                  icon_url: targetMember.user.displayAvatarURL(),
                })
                .setTitle(`Prénom: ${userDb.prenom}`)
                .setDescription(
                  `**Membre**: ${userMention(targetMember.id)}\n**Prénom**: ${userDb.prenom}\n**Date de naissance**: ${userDb.birthdate}\n**Token**: ${userDb.token}\n\nTicket fermé par ${userMention(member.id)}`
                )
                .setColor("Purple"),
            ],
            // files: [attachment],
          });
      } else if (action === "no") {
        console.log(`[VERIF] ${targetMember.user.tag} a été refusé`);
        await client.setUserInfo(targetMember, guild, [
          { key: "verified", value: false },
        ]);
        await targetMember.roles.remove(client.config.roles.verified);
        await verifModel.updateOne(
          { channelID: channel.id },
          { status: "notverified" }
        );
        await targetMember.send({
          content: `❌ ${userMention(
            targetMember.id
          )} votre vérification a été refusée.\nVeuillez vous assurer que la photo est correcte, contient le bon numéro et que vous n'êtes pas dans la limite d'âge du serveur.\nPour plus d'informations, veuillez demander à un membre du staff dans ce salon.`,
        });
      } else if (action === "delete") {
        // await client.setUserInfo(targetMember, guild, [
        //   { key: "verified", value: false },
        // ]);
        // await targetMember.roles.remove(client.config.roles.verified);
        await verifModel.updateOne(
          { channelID: channel.id },
          { status: "deleted" }
        );
        await interaction.channel.send({
          content: `❌ ${userMention(
            targetMember.id
          )} votre vérification a été refusée.\nCe salon sera supprimé d'ici quelques minutes.`,
        });
        setTimeout(() => {
          interaction.channel.delete();
        }, 2 * 3600);
      }
    }
  },
};
