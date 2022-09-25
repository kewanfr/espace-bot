const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Message,
  userMention,
} = require("discord.js");
const { departementsByRegions } = require("../../utils/infos");
const birthdateModel = require("../../schemas/birthdateModel");

module.exports = {
  help: {
    name: "birthdates",
    description: "Statistiques du serveur",
    slash: false,
    category: "moderation",
    usage: "birthdates",
    cooldown: 2,
    permission: "ManageMessages",
    deletemsg: false,
  },
  run: async (client, message, args) => {
    let guild = message.guild;
    let members = guild.members.cache;

    let monthId = parseInt(args[0]);

    if (!monthId) return message.reply("Veuillez préciser un mois !");

    let birthdatesDb = await birthdateModel.find({ guildID: guild.id });
    birthdatesDb.sort((a, b) => {
      return new Date(a.birthdate) - new Date(b.birthdate);
    });

    let months = {
      1: "Janvier",
      2: "Février",
      3: "Mars",
      4: "Avril",
      5: "Mai",
      6: "Juin",
      7: "Juillet",
      8: "Août",
      9: "Septembre",
      10: "Octobre",
      11: "Novembre",
      12: "Décembre",
    };

    let i = monthId;
    let monthName = months[i];

    let embed = new EmbedBuilder()
      .setTitle(`Anniversaires du mois de ${monthName}`)
      .setColor("Random");

    let birthdatesInMonth = birthdatesDb.filter((b) => b.month == i);
    let monthBirthdates = {};
    for (let j = 0; j < birthdatesInMonth.length; j++) {
      let birthdate = birthdatesInMonth[j];
      let member = members.get(birthdate.userID);
      if (member) {
        monthBirthdates[birthdate.day] = monthBirthdates[birthdate.day] || [];
        monthBirthdates[birthdate.day].push(birthdate);
      }
    }
    let birthdatesInMonthString = ``;
    for (let day in monthBirthdates) {
      let birthdatesInDay = monthBirthdates[day];
      let birthdatesInDayString = birthdatesInDay
        .map((b) => {
          let member = members.get(b.userID);
          return `${userMention(member.id)} ${b.birthdayMsg ? "(message)" : ""}`; // (${b.year})
        })
        .join(", ");
      birthdatesInMonthString += `**${day} ${monthName}** : ${birthdatesInDayString}\n`;
    }

    embed.setDescription(birthdatesInMonthString);

    message.channel.send({
      embeds: [embed],
    });
  },
};
