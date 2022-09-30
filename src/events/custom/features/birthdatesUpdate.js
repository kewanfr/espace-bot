const { userMention, EmbedBuilder } = require("discord.js");
const birthdateModel = require("../../../schemas/birthdateModel");
const userModel = require("../../../schemas/userModel");

module.exports = {
  name: "birthdatesUpdate",
  once: false,
  dev: true,
  async execute(client) {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let guild = client.guilds.cache.get(client.config.guildId);

    let birthdays = await birthdateModel.find();
    birthdays = birthdays.sort((a, b) => {
      if (a.month === b.month) {
        return a.day - b.day;
      } else {
        return a.month - b.month;
      }
    });

    if (day == 1) {
      let birthdatesDb = await birthdateModel.find();
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

      let monthName = months[month];

      let embed = new EmbedBuilder()
        .setTitle(`Anniversaires du mois de ${monthName}`)
        .setColor("Random")
        .setFooter({text: "Seuls les membres ayant accepté de partager leur date de naissance sont affichés."})

      let birthdatesInMonth = birthdatesDb.filter((b) => b.month == month && b.birthdayMsg == true);
      let monthBirthdates = {};
      for (let j = 0; j < birthdatesInMonth.length; j++) {
        let birthdate = birthdatesInMonth[j];
        if (birthdate.userID) {
          monthBirthdates[birthdate.day] = monthBirthdates[birthdate.day] || [];
          monthBirthdates[birthdate.day].push(birthdate);
        }
      }
      let birthdatesInMonthString = ``;
      for (let day in monthBirthdates) {
        let birthdatesInDay = monthBirthdates[day];
        let birthdatesInDayString = birthdatesInDay
          .map((b) => {
            return `${userMention(b.userID)}`; // (${b.year})
          })
          .join(", ");
        birthdatesInMonthString += `**${day} ${monthName}** : ${birthdatesInDayString}\n`;
      }

      embed.setDescription(birthdatesInMonthString);

      client.channels.cache.get(client.config.channels.birthdays).send({
        embeds: [embed],
      });
    }

    let users = await birthdateModel.find({ day: day, month: month, birthdayMsg: true });
    if (users.length > 0) {
      users.forEach((user) => {
        let age = year - user.year;

        let member = guild.members.cache.get(user.userID);
        console.log(`🎉 C'est l'Anniversaire de ${client.users.cache.get(user.userID).tag} (${age} ans)`);
        let roleId = client.config.roles.age[age];
        for(let rl in client.config.roles.age){
          let rlID = client.config.roles.age[rl];
          if(rlID == roleId){
            if(!member.roles.cache.has(rlID)){
              member.roles.add(roleId);
            }
          }else if(member.roles.cache.has(rlID)){
            member.roles.remove(rlID);
          }
        }
        userModel.updateOne({ userID: user.userID }, { age: age }).exec();
        client.channels.cache
          .get(client.config.channels.birthdays)
          .send(
            `🥳 C'est les **${age}** ans de ${userMention(
              user.userID
            )} !\n\n🎉 Souhaitez-lui tous un bon anniversaire !`
          );
      });
    }
  },
};
