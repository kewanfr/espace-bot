const { departementsByRegions } = require('../../utils/infos');

module.exports = {
  data: {
    name: 'choose-region',
  },
  async execute(client, interaction) {
    let rid = interaction.values[0];
    let region = departementsByRegions[rid];

    let regionsRoles = Object.values(departementsByRegions).map(r => r.role);
    interaction.member.roles.cache.map((role) => {
      if (regionsRoles.includes(role.id)) {
        interaction.member.roles.remove(role);
      }
    })
    interaction.member.roles.add(region.role);
    await client.setUserInfo(interaction.member, interaction.guild, [{ key: "region", value: region.rid }]);
    await interaction.reply({
      content: `✅ Le role **${region.name}** a été ajouté à votre profil.`,
      ephemeral: true
    })
  }
}