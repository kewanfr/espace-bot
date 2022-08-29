const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  AttachmentBuilder,
} = require("discord.js");

module.exports = {
  
  help: {
    name: "Présentation",
    description: "Obtenir la présentation d'un utilisateur",
    slash: "context",
    context: true
  },
  slash: [
    {
      name: "Présentation",
      type: ApplicationCommandType.User,
    }
  ],		
  runContextMenu: async (client, interaction) => {
    let member = await interaction.guild.members.fetch(interaction.targetId);

    let presentation = await client.getPresentation({ member: member, guild: interaction.guild }, true);
    let avatar = new AttachmentBuilder(member.user.displayAvatarURL({ format: 'png', size: 1024 }));

    await interaction.reply({
      content: presentation,
      files: [avatar],
      ephemeral: true,
    });
  },
};
