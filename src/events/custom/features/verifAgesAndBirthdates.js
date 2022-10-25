const { userMention, EmbedBuilder } = require("discord.js");
const birthdateModel = require("../../../schemas/birthdateModel");
const userModel = require("../../../schemas/userModel");


module.exports = {
  name: "verifAgesAndBirthdates",
  once: false,
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

    birthdays.forEach(async (birthday) => {

      let userDb = await userModel.findOne({ userID: birthday.userID });

      if (userDb) {
        let birthdate = new Date(birthday.birthdate);
        let age = client.getAgeFromDate(birthdate);
        let member = guild.members.cache.get(birthday.userID);

        let roleId = client.config.roles.age[age];
        for(let rl in client.config.roles.age){
          let rlID = client.config.roles.age[rl];
          if(rlID == roleId){
            if(!member.roles.cache.has(rlID)){
              console.log(`Age de ${client.users.cache.get(birthday.userID).tag} mis à jour à ${age}`);
              member.roles.add(roleId);
            }
          }else if(member.roles.cache.has(rlID)){
            member.roles.remove(rlID);
          }
        }
      }
      
      client.guilds.cache
        .get(client.config.guildId)
        .members.fetch(birthday.userID)
        .catch((err) => {
          birthdateModel
            .deleteOne({ userID: birthday.userID })
            .then(() => {
              client.log.client(
                `Suppression de la date de naissance de ${birthday.userID} car l'utilisateur n'est plus sur le serveur.`
              );
            })
            .catch((err) => {
              console.error(err);
            });
        });
    });
  },
};
