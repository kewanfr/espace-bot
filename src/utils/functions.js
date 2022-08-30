module.exports = (client) => {
	const { UserModel, mongoose } = client;

  client.getAgeFromDate = (date) => {
    var diff = Date.now() - date.getTime();
    var age = new Date(diff); 
    return Math.abs(age.getUTCFullYear() - 1970);
  }

	client.setUserInfo = async (member, guild, info) => {
		let { user } = member;

		let dbUser = await UserModel.findOne({ userID: user.id, guildID: guild.id });
    if(!dbUser) {
      dbUser = await new UserModel({
        _id: mongoose.Types.ObjectId(),
        userID: user.id,
        guildID: guild.id,
        username: user.username,
        discriminator: user.discriminator,
        nickname: member.displayName,
        avatar: user.displayAvatarURL(),
        roles: member.roles.cache.map(r => r.id),
        joinedAt: member.joinedAt,
      });

      await dbUser.save().catch(console.error);
    }

		if(info.length > 1) {
			for(let i = 0; i < info.length; i++) {
				dbUser[info[i].key] = info[i].value;
			}
		}else {
			dbUser[info[0].key] = info[0].value;
		}
		await dbUser.save().catch(console.error);

		return dbUser;
	}

	client.getUserInfos = async (member, guild) => {
		let { user } = member;

		let dbUser = await UserModel.findOne({ userID: user.id, guildID: guild.id });

    if(!dbUser) {
      dbUser = await new UserModel({
        _id: mongoose.Types.ObjectId(),
        userID: user.id,
        guildID: guild.id,
        username: user.username,
        discriminator: user.discriminator,
        nickname: member.displayName,
        avatar: user.displayAvatarURL(),
        roles: member.roles.cache.map(r => r.id),
        joinedAt: member.joinedAt,
      });

      await dbUser.save().catch(console.error);
    }

		return dbUser;
	}

	client.verifGuild = async(guild) => {
		if(guild.id == client.config.guildID) {
			return true;
		}else {
			return false;
		}
	}

	
}