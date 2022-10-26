const { ChannelType, PermissionFlagsBits } = require("discord.js");
const Data = require("../../../schemas/dataModel");

module.exports = {
  name: "statsChannelsUpdate",
  once: false,
  async execute(client) {
    let statsData = await Data.findOne({ name: 'lastStatsUpdate' });
    let now = new Date();
		if (!statsData) {
			statsData = await Data.create({ name: 'lastStatsUpdate', value: today.getTime(), date: now });
		}

    let lastStatsUpdate = statsData.date || now;
		let diff = Math.abs(now - lastStatsUpdate);
		var minutes = Math.floor((diff/1000)/60);

    let statsChannDatas = await Data.findOne({ name: 'statsChannels' });
		if (!statsChannDatas || !statsChannDatas.obj) {
			statsChannDatas = await Data.create({ name: 'statsChannels', obj: { membres: false }, date: now });
		}


    let guild = await client.guilds.fetch(client.config.guildId);
    
    let membresSize = guild.members.cache.filter(m => !m.user.bot).size;
    let membresChannel = await guild.channels.fetch(statsChannDatas.obj.membres);
    if(minutes >= 5 && membresChannel) {
      membresChannel.setName(`👥・Membres : ${membresSize}`);
		}else {
      if(membresChannel) membresChannel.delete();
      let channel = await guild.channels.create({name: `👥・Membres : ${membresSize}`, type: ChannelType.GuildVoice, permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionFlagsBits.Connect],
        }
      ]});

      statsChannDatas.obj = { membres: channel.id };
      statsChannDatas.date = now;
      await statsChannDatas.save();
		}

    statsData.value = now.getTime();
    statsData.date = now;
    await statsData.save();

  },
};
