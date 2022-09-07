const { AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(client, member) {
    console.log(`(${member.guild.name}) ${member.user.tag} a rejoint le serveur !`);
    if (client.verifGuild(member.guild)) {
      // client.updateStats(member.guild);
      // client.config.roles.default.forEach((role) => {
      //   member.roles.add(role);
      // });

      const memberPosition = member.guild.members.cache.filter((m) => !m.user.bot)
      .size;
      const welcomeChannel = member.guild.channels.cache.get(
        client.config.channels.welcome
      );

      // fetch(`${client.config.canvasSrvURL}/welcomeimg`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     guildName: member.guild.name,
      //     memberPosition: memberPosition,
      //     tag: member.user.tag,
      //     username: member.user.username,
      //     discriminator: member.user.discriminator,
      //     avatar: member.user
      //       .displayAvatarURL({ format: "png", size: 1024 })
      //       .replace(".webp", ".png"),
      //   }),
      // }).then(async (response) => {
      //   let arrayBuffer = await response.arrayBuffer();
      //   let buffer = Buffer.from(arrayBuffer);
      //   welcomeChannel.send({
      //     content: `😀 Bienvenue <@${member.user.id}> sur ${member.guild.name} !\nVous êtes le **${memberPosition}**ème membre de ce serveur, on espère qu'il vous plaîra !\n\nPour acceder au serveur, vous devez valider le <#${client.config.channels.rules}>, vous pourrez ensuite vous assigner vos <#${client.config.channels.roles}>`,
      //     files: [{ attachment: buffer, name: "welcome.png" }],
      //   });
      // }).catch((err) => {
        welcomeChannel.send({
          content: `😀 Bienvenue <@${member.user.id}> sur ${member.guild.name} !\nVous êtes le **${memberPosition}**ème membre de ce serveur, on espère qu'il vous plaîra !\n\nPour acceder au serveur, vous devez valider le <#${client.config.channels.rules}>, puis vous assigner vos <#${client.config.channels.roles}>`,
        });
        // console.log(err);
      // });
    }
  },
};
