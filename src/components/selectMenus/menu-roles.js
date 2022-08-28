const { genres: gender, orientations: orientation, pronoms, recherche: search, statut } = require('../../utils/infos');

module.exports = {
  data: {
    name: 'menu-roles',
    ids: [
      'choose-gender',
      'choose-orientation',
      'choose-pronoms',
      'choose-search',
      'choose-statut',
    ]
  },
  async execute(client, interaction) {
    let { customId } = interaction;

    let key = customId.split('-')[1];

    let object = eval(key);

    let roles = interaction.values.map(r => object[r]);

    let allRoles = Object.values(object).map(r => r.id);
    interaction.member.roles.cache.map((r) => {
      if (allRoles.includes(r.id)) {
        interaction.member.roles.remove(r);
      }
    })

    roles.forEach((role) => {
      interaction.member.roles.add(role.id);
    });
    await client.setUserInfo(interaction.member, interaction.guild, [{ key: key, value: roles.map((r) => r.rid) }]);
    await interaction.reply({
      content: `✅ ${roles.length > 1 ? "Les roles" : "Le role"} **${roles.map((r) => `<@&${r.id}>`).join(", ")}** ${roles.length > 1 ? "ont été ajoutés" : "a été ajouté"} à votre profil.`,
      ephemeral: true
    })
  }
}