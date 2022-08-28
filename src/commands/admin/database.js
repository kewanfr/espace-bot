const { GuildModel, mongoose } = require('../../schemas/index');

module.exports = {
	name: "database",
	description: "Renvoie des informations sur la database",
	type: ["cmd"],
	// build: new SlashCommandBuilder().setName("database").setDescription("Renvoie les informations sur la database"),
	deletemsg: true,
	run: async(client, message, args) => {
		let guildProfile = await GuildModel.findOne({ guildID: message.guild.id });
		
		if(!guildProfile) {
			guildProfile = await new GuildModel({
				_id: mongoose.Types.ObjectId(),
				guildID: message.guild.id,
				guildName: message.guild.name,
				guildIcon: message.guild.iconURL() ? message.guild.iconURL() : null
			});

			await guildProfile.save().catch(console.error);
			await message.channel.send({content: `Server Name: ${guildProfile.guildName}`});
			return;
		}else {
			await message.channel.send({content: `Server ID: ${guildProfile.guildID}`});
		}
	}
};