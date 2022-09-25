const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Message,
} = require("discord.js");
const { departementsByRegions } = require("../../utils/infos");
const birthdateModel = require("../../schemas/birthdateModel");

module.exports = {
  help: {
    name: "stats",
    description: "Statistiques du serveur",
    slash: false,
    category: "moderation",
    usage: "stats",
    cooldown: 2,
    permission: "ManageMessages",
    deletemsg: true,
  },
  run: async (client, message, args) => {
    let guild = message.guild;
    let members = guild.members.cache.filter((m) => !m.user.bot);
    let membersSize = members.size;
    let membersWithRole = members.filter((m) =>
      m.roles.cache.get(client.config.roles.member)
    ).size;
    let membersWithoutRole = members.filter(
      (m) => !m.roles.cache.get(client.config.roles.member)
    ).size;

    let channels = guild.channels.cache;
    let textChannels = channels.filter((c) => c.isTextBased()).size;
    let voiceChannels = channels.filter((c) => c.isVoiceBased()).size;
    let roles = guild.roles.cache;
    let rolesSize = roles.size;
    let emojis = guild.emojis.cache;
    let emojisSize = emojis.size;

    let rolesRegions = ``;
    for (const r in departementsByRegions) {
      let region = departementsByRegions[r];
      let membersInRegion = message.guild.roles.cache.get(region.role).members
        .size;
      if (membersInRegion > 0)
        rolesRegions += `${region.name}: **${membersInRegion}** membres\n`;
    }

    let rolesAges = ``;
    for (const r in client.config.roles.age) {
      let age = client.config.roles.age[r];
      let membersInAge = message.guild.roles.cache.get(age).members.size;
      if (membersInAge > 0) rolesAges += `${r}: **${membersInAge}** membres\n`;
    }

    let birthdatesDb = await birthdateModel.find({ guildID: guild.id });
    birthdatesDb.sort((a, b) => {
      return new Date(a.birthdate) - new Date(b.birthdate);
    });
    let birthdates = birthdatesDb
      .map((b) => `${b.day}/${b.month}/${b.year}`)
      .join("\n");

    let embedstats = new EmbedBuilder()
      .setTitle("Statistiques du serveur")
      .setDescription(
        `Membres: **${membersSize}**\nMembres avec rôle: **${membersWithRole}**\nMembres sans role: **${membersWithoutRole}**\n\nSalons textuels: **${textChannels}**\nSalons vocaux: **${voiceChannels}**\nRoles: **${rolesSize}**\nEmojis: **${emojisSize}**`
      )
      .setColor("Blurple")
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setTimestamp();

    let embedRegions = new EmbedBuilder()
      .setTitle("Roles Régions")
      .setDescription(rolesRegions)
      .setColor("Aqua");

    let embedAges = new EmbedBuilder()
      .setTitle("Roles Ages")
      .setDescription(rolesAges)
      .setColor("Fuchsia");

    let embedBirthdate = new EmbedBuilder()
      .setTitle("Dates de naissances")
      .setDescription(birthdates)
      .setColor("Green");

    message.channel.send({
      embeds: [embedRegions, embedAges, embedBirthdate, embedstats],
    });
  },
};
