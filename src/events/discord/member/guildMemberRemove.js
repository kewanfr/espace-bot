const { EmbedBuilder, userMention, time, TimestampStyles } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  once: false,
  dev: true,
  async execute(client, member) {
    console.log(`(${member.guild.name}) ${member.user.tag} a quitté le serveur !`);
    if(member.user.bot) return;
    if(client.verifGuild(member.guild)){
      // client.updateStats(member.guild);

      const memberPosition = member.guild.members.cache.filter((m) => !m.user.bot)
      .size;

      const welcomeChannel = member.guild.channels.cache.get(client.config.channels.welcome);
      const logsChannel = member.guild.channels.cache.get(client.config.channels.logs);
      
      const creationTime = time(client.toTimestamp(member.user.createdAt), TimestampStyles.LongDate);
      const creationRTime = time(client.toTimestamp(member.user.createdAt), TimestampStyles.RelativeTime);
      const joinedTime = time(client.toTimestamp(member.joinedAt), TimestampStyles.LongDate);
      const joinedRTime = time(client.toTimestamp(member.joinedAt), TimestampStyles.RelativeTime);

      let embed = new EmbedBuilder()
        .setTitle(`${member.displayName} a quitté le serveur !`)
        .setDescription(`${userMention(member.id)}`)
        .addFields([
          {
            name: "Informations",
            value: `**Pseudo :** ${member.displayName}\n**Tag :** ${member.user.tag}\n**ID :** ${member.id}\n**Compte créé le :** ${creationTime} (${creationRTime})`,
            inline: true,
          },
          {
            name: "Informations serveur",
            value: `**Membres :** ${memberPosition}\n**Rejoint le :** ${joinedTime} (${joinedRTime})`,
            inline: true,
          },
          {
            name: "Rôles",
            value: ` ${member.roles.cache
              .filter((r) => r.id !== member.guild.id)
              .map((roles) => `<@&${roles.id}>`)
              .join(" **|** ") || "Aucun"}`,
          }
        ])
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setColor("Red")

      logsChannel.send({embeds: [embed]});

      welcomeChannel.send({
        content: `<@${member.user.id}> (**${member.user.tag}**) a quitté le serveur ! 😢`,
      });
    }
  },
};
