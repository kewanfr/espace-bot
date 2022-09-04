const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

let clearMessages = async (amount, channel) => {
  if (amount <= 100) {
    await channel.bulkDelete(amount, true);
    return true;
  } else if (amount <= 200) {
    await channel.bulkDelete(100, true);
    let left = amount - 100;
    setTimeout(() => {
      channel.bulkDelete(left, true);
      return true;
    }, 2000);
  } else if (amount <= 300) {
    await channel.bulkDelete(100, true);
    setTimeout(() => {
      channel.bulkDelete(left, true);
    }, 2000);
    let left = amount - 200;
    setTimeout(() => {
      channel.bulkDelete(left, true);
      return true;
    }, 2000);
  }
};
module.exports = {
  help: {
    name: "clear",
    description: "Supprimer plusieurs messages",
    slash: 'both',
    category: "moderation",
    aliases: ["clear", "purge", "delete"],
    usage: "clear <nombre>",
    cooldown: 5,
    permission: "ManageMessages",
    deletemsg: true,
  },
  slash: [
    {
      name: "clear",
      description: "Supprimer plusieurs messages",
      default_member_permissions: "ManageMessages",
      options: [
        {
          name: "amount",
          description: "Nombre de messages à supprimer",
          type: 10,
          min_value: 1,
          max_value: 300,
          required: true,
        },
      ],
    },
    {
      name: "purge",
      description: "Supprimer plusieurs messages",
      default_member_permissions: "ManageMessages",
      options: [
        {
          name: "amount",
          description: "Nombre de messages à supprimer",
          type: 10,
          min_value: 1,
          max_value: 300,
          required: true,
        },
      ],
    }
  ],
  run: async (client, message, args) => {
    let amount = args[0] || 100;
    if(amount > 300) return message.channel.send({content: "❌ Vous ne pouvez pas supprimer plus de **300** messages !"});
    await clearMessages(amount, message.channel);
    message.channel
      .send({
        content: `**${amount}** messages supprimés.`,
      })
      .then((msg) => setTimeout(() => msg.delete(), 5000));
  },
  runSlash: async (client, interaction) => {
    let amount = interaction.options.getNumber("amount");
    await clearMessages(amount, interaction.channel);
    interaction.reply({
      content: `**${amount}** messages supprimés.`,
      ephemeral: true,
    });
  },
};
