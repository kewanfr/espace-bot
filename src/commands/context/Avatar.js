const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require("discord.js");

module.exports = {
  help: {
    name: "Avatar",
    description: "Obtenir l'avatar d'un utilisateur",
    slash: "context",
    context: true
  },
  slash: [
    {
      name: "Avatar",
      type: ApplicationCommandType.User,
    }
  ],
  runContextMenu: async (client, interaction) => {
    await interaction.reply({
      content: `${interaction.targetUser.displayAvatarURL()}`,
      ephemeral: true,
    });
  },
};
