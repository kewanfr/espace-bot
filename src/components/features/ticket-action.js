const {
  EmbedBuilder,
  PermissionFlagsBits,
  userMention,
} = require("discord.js");
const ticketModel = require("../../schemas/ticketModel");
const { createTranscript } = require("discord-html-transcripts");

module.exports = {
  data: {
    name: "ticket-action",
    buttons: ["ticket-saveandclose", "ticket-close", "ticket-lock", "ticket-unlock"],
  },
  async execute(client, interaction) {
    let { customId, guild, member, channel } = interaction;

    if (!member.permissions.has(PermissionFlagsBits.ManageMessages))
      return interaction.reply({
        content: "❌ Seul le staff peut utiliser ces boutons",
        ephemeral: true,
      });

    let action = customId.split("-")[1];

    const Embed = new EmbedBuilder().setColor("Blue");

    let docs = await ticketModel.findOne({ channelID: channel.id });
    // if(err) throw err;
    if (!docs)
      return interaction.reply({
        content:
          "❌ Aucune donnée trouvée à propos de ce ticket, veuillez le supprimer manuelement.",
        ephemeral: true,
      });
    
    switch (action) {
      case "lock":
        if (docs.locked == true)
          return interaction.reply({
            content: "❌ Ce ticket est déjà verrouillé",
            ephemeral: true,
          });
        await ticketModel.updateOne(
          { channelID: channel.id },
          { locked: true }
        );
        Embed.setDescription(
          `🔒 Ce ticket a été verrouillé par ${userMention(member.id)}`
        );
        await channel.permissionOverwrites.edit(docs.userID, {
          SendMessages: false,
        });
        interaction.reply({ embeds: [Embed] });
        break;

      case "unlock":
        if (docs.locked == false)
          return interaction.reply({
            content: "❌ Ce ticket est déjà déverrouillé",
            ephemeral: true,
          });
        await ticketModel.updateOne(
          { channelID: channel.id },
          { locked: false }
        );
        Embed.setDescription(
          `🔓 Ce ticket a été déverrouillé par ${userMention(member.id)}`
        );
        await channel.permissionOverwrites.edit(docs.userID, {
          SendMessages: true,
        });
        interaction.reply({ embeds: [Embed] });
        break;

      case "saveandclose":
        if (docs.closed == true)
          return interaction.reply({
            content:
              "❌ Ce ticket est déjà fermé, veuillez attendre sa suppression",
            ephemeral: true,
          });
        const attachment = await createTranscript(channel, {
          limit: -1,
          returnBuffer: false,
          fileName: `${docs.type} - ${docs.ticketID}.html`,
        });
        await ticketModel.updateOne(
          { channelID: channel.id },
          { closed: true }
        );

        const MEMBER = guild.members.cache.get(docs.userID);
        const Message = await guild.channels.cache
          .get(client.config.channels.tickets.transcript)
          .send({
            embeds: [
              Embed.setAuthor({
                name: MEMBER.user.tag,
                icon_url: MEMBER.user.displayAvatarURL(),
              })
                .setTitle(`Type: ${docs.type} | ID: ${docs.ticketID}`)
                .setDescription(
                  `**Membre**: ${userMention(MEMBER.id)}\n**Sujet**: ${docs.sujet}\n**Message**: ${
                    docs.description
                  }\n\nTicket fermé par ${userMention(member.id)}`
                )
                .setColor("Purple")
            ],
            files: [attachment],
          });

        interaction.reply({
          embeds: [
            Embed.setDescription(
              `Le ticket a été sauvegardé: [TRANSCRIPTION](${
                Message.url
              })`
            ),
          ],
        });

        MEMBER.send({
          content: `Votre ticket *${docs.type}* (ID: ${docs.ticketID}) a été fermé par ${userMention(member.id)}.\nSi votre problème n'a pas été résolu, veuillez ouvrir un nouveau ticket.\n\nMerci de votre compréhension.`,
        });

        setTimeout(() => {
          channel.delete();
        }, 10 * 1000);
        break;

        case "close":
          if (docs.closed == true)
            return interaction.reply({
              content:
                "❌ Ce ticket est déjà fermé, veuillez attendre sa suppression",
              ephemeral: true,
            });
          await ticketModel.updateOne(
            { channelID: channel.id },
            { closed: true }
          );
  
          const Membre = guild.members.cache.get(docs.userID);
          await guild.channels.cache
            .get(client.config.channels.tickets.transcript)
            .send({
              embeds: [
                Embed.setAuthor({
                  name: Membre.user.tag,
                  icon_url: Membre.user.displayAvatarURL(),
                })
                  .setTitle(`Type: ${docs.type} | ID: ${docs.ticketID}`)
                  .setDescription(
                    `**Membre**: ${userMention(Membre.id)}\n**Sujet**: ${docs.sujet}\n**Message**: ${
                      docs.description
                    }\n\nTicket fermé par ${userMention(member.id)}`
                  )
                  .setColor("Red")
              ],
            });
            interaction.reply({
            embeds: [
              Embed.setDescription(
                `🗑 Ticket fermé par ${userMention(member.id)}`
              ),
            ],
          });

          Membre.send({
            content: `Votre ticket *${docs.type}* (ID: ${docs.ticketID}) a été fermé par ${userMention(member.id)}.\nSi votre problème n'a pas été résolu, veuillez ouvrir un nouveau ticket.\n\nMerci de votre compréhension.`,
          });
  
          setTimeout(() => {
            channel.delete();
          }, 10 * 1000);
          break;

      default:
        break;
    }

    
  },
};
