module.exports = {
  data:{
    name: "birthdate",
  },
  async execute(client, interaction){
    const { BirthdateModel, UserModel, mongoose } = client;
    
    let birthdate = interaction.fields.getTextInputValue("birthdateInput");
    let split = birthdate.split("/");
    let day = split[0];
    let month = split[1];
    let year = split[2];
    const age = await client.getAgeFromDate(new Date(year, month, day));
    
    let user = await UserModel.findOne({ userID: interaction.user.id, guildID: interaction.guild.id });
    let birthdateEntry = await BirthdateModel.findOne({ userID: interaction.user.id, guildID: interaction.guild.id });
    
    if(!user) {
      user = await new UserModel({
        _id: mongoose.Types.ObjectId(),
        userID: interaction.user.id,
        guildID: interaction.guild.id,
        username: interaction.user.username,
        discriminator: interaction.user.discriminator,
        nickname: interaction.member.displayName,
        avatar: interaction.user.displayAvatarURL(),
        roles: interaction.member.roles.cache.map(r => r.id),
        joinedAt: interaction.member.joinedAt,
        age: age,

        birthdate: new Date(year, month, day),
      });

      await user.save().catch(console.error);
    }else {
      user.birthdate = birthdate;

      user.age = age;
      await user.save().catch(console.error);
    }


    if(!birthdateEntry) {

      birthdateEntry = await new BirthdateModel({
        _id: mongoose.Types.ObjectId(),
        userID: interaction.user.id,
        guildID: interaction.guild.id,
        birthdate: new Date(year, month, day),
        day: day,
        month: month,
        year: year,
      });
      await birthdateEntry.save().catch(console.error);
    }else {
      birthdateEntry.birthdate = birthdate;
      birthdateEntry.day = day;
      birthdateEntry.month = month;
      birthdateEntry.year = year;
      await birthdateEntry.save().catch(console.error);
    }


    interaction.member.roles.add(client.config.roles.member);

    let roles = client.config.roles.age;
    let allRoles = Object.keys(roles).map((r) => roles[r]);
    interaction.member.roles.cache.map((r) => {
      if (allRoles.includes(r.id)) {
        interaction.member.roles.remove(r.id);
      }
    })
    interaction.member.roles.add(roles[age]);

    if(interaction.channel.id === client.config.channels.birthdays) {
      
      await interaction.reply({ content: `✅ Date de naissance modifiée: ${interaction.fields.getTextInputValue("birthdateInput")}`, ephemeral: true });
    }else {
      await interaction.reply({ content: `✅ Votre date de naissance a été définie sur: ${interaction.fields.getTextInputValue("birthdateInput")}\n Vous pouvez désormais acceder au serveur, on espère qu'il vous plaira !\nVous pouvez choisir vos rôles dans <#${client.config.channels.roles}>`, ephemeral: true });
    }



  }
};