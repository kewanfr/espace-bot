const birthdateModel = require('../../schemas/birthdateModel');

module.exports = {
  data: {
    name: 'choose-birthday-msg',
  },
  async execute(client, interaction) {
    let value = interaction.values[0];

    let birthdateEntry = await birthdateModel.findOne({ userID: interaction.user.id, guildID: interaction.guild.id });

    if (value === 'yes') {
      birthdateEntry.birthdayMsg = true;
      
      await birthdateEntry.save().catch(console.error);

      interaction.reply({
        content: `✅ Vous avez choisi de recevoir un message lorsque votre anniversaire arrive.`,
        ephemeral: true,
      });
    }else {
      birthdateEntry.birthdayMsg = false;
      
      await birthdateEntry.save().catch(console.error);

      interaction.reply({
        content: `❌ Vous avez choisi de ne pas recevoir de message lorsque votre anniversaire arrive.`,
        ephemeral: true,
      });
    }
  }
}