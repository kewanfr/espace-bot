const Data = require("../../schemas/dataModel");

module.exports = {

  birthdateUpdateExecute: async (client) => {
    let birthdateData = await Data.findOne({ name: 'lastBirthdateUpdate' });
		let today = new Date();
		if (!birthdateData) {
			birthdateData = await Data.create({ name: 'lastBirthdateUpdate', value: today.getTime(), date: today });
			client.emit('birthdatesUpdate');
		}

		client.birthdateFunction = async () => {
			let lastBirthdateUpdate = birthdateData.date || new Date();
			let now = new Date();
			if(now.getDate() != lastBirthdateUpdate.getDate()) {
				birthdateData.value = now.getTime();
				birthdateData.date = now;
				await birthdateData.save();
				client.emit('birthdatesUpdate');
			}
		}
		client.birthdateInterval = setInterval(client.birthdateFunction, 28800000); // 7200000 - 8h
		client.birthdateFunction();
  },

}