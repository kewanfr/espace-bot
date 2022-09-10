const { userMention } = require("discord.js");
const birthdateModel = require("../../../schemas/birthdateModel");

module.exports = {
  name: "birthdatesUpdate",
  once: false,
  dev: true,
  async execute(client) {

    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    let birthdays = await birthdateModel.find();
    birthdays = birthdays.sort((a, b) => {
      if (a.month === b.month) {
        return a.day - b.day;
      } else {
        return a.month - b.month;
      }
    });

		birthdays.forEach(birthday => {
			client.guilds.cache.get("1011246580889813012").members.fetch(birthday.userID).catch(err => {
				birthdateModel.deleteOne({ userID: birthday.userID }).then(() => {
					client.log.client(`Suppression de la date de naissance de ${birthday.userID} car l'utilisateur n'est plus sur le serveur.`);
				}).catch(err => {
					console.error(err);
				});
			});

		})

    let users = await birthdateModel.find({ day: day, month: month });
    if(users.length > 0) {
      users.forEach(user => {
        let age = year - user.year;
        client.channels.cache.get(client.config.channels.birthdays).send(`🥳 C'est les **${age}** ans de ${userMention(user.userID)} !\n\n🎉 Souhaitez-lui tous un bon anniversaire !`);
      });
    }

  },
}