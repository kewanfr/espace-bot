const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require("discord.js");

module.exports = {
  name: "Avatar",
  description: "Obtenir l'avatar d'un utilisateur",
  type: ["context"],
  aliases: ["bouton"],
  build: new ContextMenuCommandBuilder()
    .setName("Avatar")
    .setType(ApplicationCommandType.User),
		
  runContextMenu: async (client, interaction) => {
    await interaction.reply({
      content: `${interaction.targetUser.displayAvatarURL()}`,
      ephemeral: true,
    });
  },
};
