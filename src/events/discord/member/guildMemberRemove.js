module.exports = {
  name: "guildMemberRemove",
  once: false,
  async execute(client, member) {
    if(client.verifGuild(member.guild)){
      // client.updateStats(member.guild);
      const leaveChannel = member.guild.channels.cache.get(
        client.config.channels.leave
      );
      leaveChannel.send({
        content: `<@${member.user.id}> (**${member.user.tag}**) a quitté le serveur ! 😢`,
      });
      const logsChannel = member.guild.channels.cache.get(
        client.config.channels.logs
      );
      logsChannel.send({
        content: `<@${member.user.id}> ${member.user.tag} (ID: ${member.user.id}) a quitté le serveur ! 😢`,
      });
    }
  },
};
