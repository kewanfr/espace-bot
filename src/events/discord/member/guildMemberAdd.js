const { AttachmentBuilder, EmbedBuilder, userMention } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  dev: true,
  async execute(client, member) {
    console.log(`(${member.guild.name}) ${member.user.tag} a rejoint le serveur !`);
    if(member.user.bot) return;
    if (client.verifGuild(member.guild)) {

      const memberPosition = member.guild.members.cache.filter((m) => !m.user.bot)
      .size;
      const welcomeChannel = member.guild.channels.cache.get(client.config.channels.welcome);
      const logChannel = member.guild.channels.cache.get(client.config.channels.logs);

      let embed = new EmbedBuilder()
        .setTitle(`${member.displayName} a rejoint le serveur !`)
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
        .setColor("DarkGold")

      logChannel.send({embeds: [embed]});

      welcomeChannel.send({
        content: `😀 Bienvenue <@${member.user.id}> sur ${member.guild.name} !\nVous êtes le **${memberPosition}**ème membre de ce serveur, on espère qu'il vous plaîra !\n\nPour acceder au serveur, vous devez valider le <#${client.config.channels.rules}>, puis vous assigner vos <#${client.config.channels.roles}>`,
      });
    }
  },
};
