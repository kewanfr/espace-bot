const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SelectMenuBuilder,
  ComponentBuilder,
  Component,
  ComponentType,
} = require("discord.js");

module.exports = {
  data: {
    name: "birthdate",
    modals: ["birthdate-modal"],
    buttons: ["birthdate-btn"],
    selectMenus: ["choose-birthday-msg"],
  },
dev: true,
  async execute(client, interaction) {
    let { customId, guild, member, channel } = interaction;
    const { BirthdateModel, UserModel, mongoose } = client;

    if (customId === "birthdate-btn") {
      const modal = new ModalBuilder()
        .setCustomId("birthdate-modal")
        .setTitle("Votre date de naissance");
      const dayInput = new TextInputBuilder()
        .setCustomId("dayInput")
        .setLabel("Jour")
        .setPlaceholder("Format: JJ (exemple : 12)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(2);

      const monthInput = new TextInputBuilder()
        .setCustomId("monthInput")
        .setLabel("Mois")
        .setPlaceholder("Format: MM (exemple : 02 ou 2)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(2);

      const yearInput = new TextInputBuilder()
        .setCustomId("yearInput")
        .setLabel("Année")
        .setPlaceholder("Format: AAAA (exemple : 2002)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(4);

      modal.addComponents(new ActionRowBuilder().addComponents([dayInput]), new ActionRowBuilder().addComponents([monthInput]), new ActionRowBuilder().addComponents([yearInput]));

      await interaction.showModal(modal);
    } else if (customId === "birthdate-modal") {
      let day = parseInt(interaction.fields.getTextInputValue("dayInput"));
      let month = parseInt(interaction.fields.getTextInputValue("monthInput"));
      let year = parseInt(interaction.fields.getTextInputValue("yearInput"));
      let birthdate = `${day}/${month}/${year}`;
      console.log(`${interaction.user.tag}: ${birthdate}`);
      if(!client.testBirthdate(birthdate) || !day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year) || day > 31 || month > 12 || year < 1990) return interaction.reply({
        content: "❌ Veuillez entrer une date de naissance valide.\nFormat : JJ/MM/AAAA (exemple : 01/12/2000)",
        ephemeral: true
      });
      const age = await client.getAgeFromDate(new Date(`${month}-${day}-${year}`));
      
      if(age > 30){
        return await interaction.reply({
          content: `❌ Vous avez + de 30 ans, vous ne pouvez pas acceder au serveur !\nOu alors vous avez fait une erreur dans le format, il doit être: JJ/MM/AAAA (exemple : 01/12/2000)`,
          ephemeral: true,
        })
      }else {
        await client.setBirthdate(interaction, day, month, year, age);
        
        interaction.member.roles.add(client.config.roles.member);
  
        let roles = client.config.roles.age;
        let allRoles = Object.keys(roles).map((r) => roles[r]);
        interaction.member.roles.cache.map((r) => {
          if (allRoles.includes(r.id)) {
            interaction.member.roles.remove(r.id);
          }
        });
        interaction.member.roles.add(roles[age]);
  
        if (interaction.channel.id === client.config.channels.birthdays) {
          await interaction.reply({
            content: `✅ Date de naissance modifiée: ${birthdate}`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `✅ Votre date de naissance a été définie sur: ${birthdate}\nVous pouvez désormais acceder au serveur, on espère qu'il vous plaira !\nVous pouvez choisir vos rôles dans <#${
              client.config.channels.roles
            }>`,
            ephemeral: true,
          });
        }
      }
    } else if (customId === "choose-birthday-msg") {
      let value = interaction.values[0];

      let birthdateEntry = await BirthdateModel.findOne({
        userID: interaction.user.id,
        guildID: interaction.guild.id,
      });

      if (value === "yes") {
        birthdateEntry.birthdayMsg = true;

        await birthdateEntry.save().catch(console.error);

        interaction.reply({
          content: `✅ Vous avez choisi de recevoir un message lorsque votre anniversaire arrive.`,
          ephemeral: true,
        });
      } else {
        birthdateEntry.birthdayMsg = false;

        await birthdateEntry.save().catch(console.error);

        interaction.reply({
          content: `❌ Vous avez choisi de ne pas recevoir de message lorsque votre anniversaire arrive.`,
          ephemeral: true,
        });
      }
    }
  },
};
