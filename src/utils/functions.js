module.exports = (client) => {
  const { UserModel, mongoose, BirthdateModel } = client;

  client.generateNumber = (length) => {
    return client.generateNumberBetween(Math.pow(10, length - 1), Math.pow(10, length) - 1);
  }
  
  client.generateNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  client.getAgeFromDate = (date) => {
    var diff = Date.now() - date.getTime();
    var age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
  };

  client.setPrenom = async (interaction, prenom) => {
    await client.setUserInfo(interaction.member, interaction.guild, [
      { key: "prenom", value: prenom },
    ]);
  }

  client.setBirthdate = async (interaction, day, month, year, age) => {
    let birthdateDate = `${year}-${month}-${day}`;
    
    let birthdateEntry = await BirthdateModel.findOne({
      userID: interaction.user.id,
      guildID: interaction.guild.id,
    });

    await client.setUserInfo(interaction.member, interaction.guild, [
      { key: "age", value: age },
      { key: "birthdate", value: birthdateDate },
    ]);

    if (!birthdateEntry) {
      birthdateEntry = await new BirthdateModel({
        _id: mongoose.Types.ObjectId(),
        userID: interaction.user.id,
        guildID: interaction.guild.id,
        birthdate: birthdateDate,
        day: day,
        month: month,
        year: year,
      });
      await birthdateEntry.save().catch(console.error);
    } else {
      birthdateEntry.birthdate = birthdateDate;
      birthdateEntry.day = day;
      birthdateEntry.month = month;
      birthdateEntry.year = year;
      await birthdateEntry.save().catch(console.error);
    }
  };

  client.testBirthdate = (birthdate) => {
    const birthdateRegex =
      /^(?:0[1-9]|[12]\d|3[01])([\/.-])(?:0[1-9]|1[012])\1(?:19|20)\d\d$/;

    if (!birthdateRegex.test(birthdate)) {
      return false;
    }
    return true;
  };

  client.setUserInfo = async (member, guild, info) => {
    let { user } = member;

    let dbUser = await UserModel.findOne({
      userID: user.id,
      guildID: guild.id,
    });
    if (!dbUser) {
      dbUser = await new UserModel({
        _id: mongoose.Types.ObjectId(),
        userID: user.id,
        guildID: guild.id,
        username: user.username,
        discriminator: user.discriminator,
        nickname: member.displayName,
        avatar: user.displayAvatarURL(),
        roles: member.roles.cache.map((r) => r.id),
        joinedAt: member.joinedAt,
      });

      await dbUser.save().catch(console.error);
    }

    if (info.length > 1) {
      for (let i = 0; i < info.length; i++) {
        dbUser[info[i].key] = info[i].value;
      }
    } else {
      dbUser[info[0].key] = info[0].value;
    }
    await dbUser.save().catch(console.error);

    return dbUser;
  };

  client.getUserInfos = async (member, guild) => {
    let { user } = member;

    let dbUser = await UserModel.findOne({
      userID: user.id,
      guildID: guild.id,
    });

    if (!dbUser) {
      dbUser = await new UserModel({
        _id: mongoose.Types.ObjectId(),
        userID: user.id,
        guildID: guild.id,
        username: user.username,
        discriminator: user.discriminator,
        nickname: member.displayName,
        avatar: user.displayAvatarURL(),
        roles: member.roles.cache.map((r) => r.id),
        joinedAt: member.joinedAt,
      });

      await dbUser.save().catch(console.error);
    }

    return dbUser;
  };

  client.verifGuild = async (guild) => {
    if (guild.id == client.config.guildID) {
      return true;
    } else {
      return false;
    }
  };
};
