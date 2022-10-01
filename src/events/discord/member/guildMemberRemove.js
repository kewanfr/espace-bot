const { EmbedBuilder, userMention } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  once: false,
  async execute(client, member) {
    console.log(`(${member.guild.name}) ${member.user.tag} a quitté le serveur !`);
    if(member.user.bot) return;
    if(client.verifGuild(member.guild)){

      const memberPosition = member.guild.members.cache.filter((m) => !m.user.bot)
      .size;
      const logsChannel = member.guild.channels.cache.get(client.config.channels.logs);

      let embed = new EmbedBuilder()
        .setTitle(`${member.displayName} a quitté le serveur !`)
        .setDescription(`${userMention(member.id)}`)
        .addFields([
          {
            name: "Informations",
            value: `**Pseudo :** ${member.displayName}\n**Tag :** ${member.user.tag}\n**ID :** ${member.id}\n**Compte créé le :** <t:${client.toTimestamp(member.user.createdAt)}:F>`,
            inline: true,
          },
          {
            name: "Informations serveur",
            value: `**Rejoint le :** <t:${client.toTimestamp(member.joinedAt)}:F>\n**Membres :** ${memberPosition}`,
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

      // const leaveChannel = member.guild.channels.cache.get(client.config.channels.leave);
      const welcomeChannel = member.guild.channels.cache.get(client.config.channels.welcome);
      
      welcomeChannel.send({
        content: `<@${member.user.id}> (**${member.user.tag}**) a quitté le serveur ! 😢`,
      });
    }
  },
};
