const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  help: {
    name: "send",
    description: "Faire envoyer un message par le bot",
    slash: 'both',
    category: "moderation",
    aliases: ["message", "msg"],
    usage: "send <content>",
    cooldown: 5,
    permission: "ManageMessages",
    deletemsg: true,
  },
  slash: [
    {
      name: 'send',
      description: 'Faire envoyer un message par le bot',
      default_member_permissions: "ManageMessages",
      options: [
        {
          required: true,
          type: 3,
          name: 'message',
          description: 'Message à envoyer'
        },
        {
          required: false,
          type: 7,
          name: 'salon',
          description: 'Salon où envoyer le message'
        }
      ],
    }
  ],
  run: async (client, message, args) => {
    let content = args.join(" ");
    if(!content) return message.channel.send({content: "❌ Vous devez entrer un message à envoyer !"});
    content = content.replace("%everyone", "@everyone").replace("%here", "@here");
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
