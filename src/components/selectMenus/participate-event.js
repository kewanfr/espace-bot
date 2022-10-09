module.exports = {
  data: {
    name: "participate-event",
  },
  async execute(client, interaction) {
    let { customId, guild, member, channel } = interaction;
    let value = interaction.values[0];

    if (value === "yes") {
      await member.roles.add("1028674055521452072");

      interaction.reply({
        content: `✅ Vous avez choisi de participer à l'évènement`,
        ephemeral: true,
      });
    } else {
      await member.roles.remove("1028674055521452072");

      interaction.reply({
        content: `❌ Vous avez choisi de ne pas participer à l'évènement.`,
        ephemeral: true,
      });
    }
  },
};
