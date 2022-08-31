const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalSubmitInteraction,
} = require("discord.js");

module.exports = {
  data: {
    name: "birthdate",
    modals: ["birthdate-modal"],
    buttons: ["birthdate-btn"],
    selectMenus: ["choose-birthday-msg"],
  },
  async execute(client, interaction) {
    let { customId, guild, member, channel } = interaction;
    const { BirthdateModel, UserModel, mongoose } = client;

    if (customId === "birthdate-btn") {
      const modal = new ModalBuilder()
        .setCustomId("birthdate-modal")
        .setTitle("Votre date de naissance");

      const textInput = new TextInputBuilder()
        .setCustomId("birthdateInput")
        .setLabel("Date de naissance")
        .setPlaceholder("Format : JJ/MM/AAAA (exemple : 01/12/2000)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents([textInput]));

      await interaction.showModal(modal);
    } else if (customId === "birthdate-modal") {
      let birthdate = interaction.fields.getTextInputValue("birthdateInput");
      let split = birthdate.split("/");
      let day = parseInt(split[0]);
      let month = parseInt(split[1]);
      let year = parseInt(split[2]);
      if(!client.testBirthdate(birthdate) || !day || !month || !year || isNaN(day) || isNaN(month) || isNaN(day) || day > 31 || month > 12) return interaction.reply({
        content: "❌ Veuillez entrer une date de naissance valide.\nFormat : JJ/MM/AAAA (exemple : 01/12/2000)",
        ephemeral: true
      });
      const age = await client.getAgeFromDate(new Date(`${month}-${day}-${year}`));
      
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
          content: `✅ Date de naissance modifiée: ${interaction.fields.getTextInputValue(
            "birthdateInput"
          )}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `✅ Votre date de naissance a été définie sur: ${interaction.fields.getTextInputValue(
            "birthdateInput"
          )}\nVous pouvez désormais acceder au serveur, on espère qu'il vous plaira !\nVous pouvez choisir vos rôles dans <#${
            client.config.channels.roles
          }>`,
          ephemeral: true,
        });
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