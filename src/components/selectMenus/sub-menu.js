module.exports = {
  data: {
    name: 'sub-menu',
  },
  async execute(client, interaction) {
    await interaction.reply({
      content: `Vous avez sélectionné ${interaction.values[0]}`
    })
  }
}