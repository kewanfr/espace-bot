const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "send",
  description: "Faire envoyer un message par le bot",
  type: ["slash", "cmd"],
  aliases: ["message", "msg"],
  build: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Faire envoyer un message par le bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Message à envoyer")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("salon")
        .setDescription("Salon où envoyer le message")
        .setRequired(false)
    ),
  deletemsg: true,
  run: async (client, message, args) => {
    let content = args.join(" ");
    if(!content) return message.channel.send({content: "❌ Vous devez entrer un message à envoyer !"});
    message.channel.send({content});
  },
  runSlash: async (client, interaction) => {
    let content = interaction.options.getString("message");
    let channel = interaction.options.getChannel("salon");

    if(!content) return interaction.reply({content: "❌ Vous devez entrer un message à envoyer !", ephemeral: true});

    if(channel) {
      await channel.send({content});
    } else {
      await interaction.channel.send({content});
    }

    interaction.reply({
      content: "✅ Message envoyé.",
      ephemeral: true,
    });
  },
};
