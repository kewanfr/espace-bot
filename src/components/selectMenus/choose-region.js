const { departementsByRegions } = require('../../utils/infos');

module.exports = {
  data: {
    name: 'choose-region',
  },
  async execute(client, interaction) {
    let rid = interaction.values[0];
    let region = departementsByRegions[rid];

    let roles = interaction.values.map(r => departementsByRegions[r]);

    let regionsRoles = Object.values(departementsByRegions).map(r => r.role);
    interaction.member.roles.cache.map((role) => {
      if (regionsRoles.includes(role.id)) {
        interaction.member.roles.remove(role);
      }
    })
    

    roles.forEach((role) => {
      interaction.member.roles.add(role.role);
    });
    await client.setUserInfo(interaction.member, interaction.guild, [{ key: "region", value: roles.map((r) => r.rid) }]);
    await interaction.reply({
      content: `✅ ${roles.length > 1 ? "Les roles" : "Le role"} **${roles.map((r) => `<@&${r.role}>`).join(", ")}** ${roles.length > 1 ? "ont été ajoutés" : "a été ajouté"} à votre profil.`,
      ephemeral: true
    })
  }
}