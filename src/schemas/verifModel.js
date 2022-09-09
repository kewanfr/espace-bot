const { Schema, model } = require('mongoose');

const verifSchem = new Schema({
  _id: Schema.Types.ObjectId,
  userID: String,
  guildID: String,
  channelID: String,
  closed: Boolean,
  prenom: String,
  birthdate: String,
  token: String,
  status: String
})

module.exports = model('Verif', verifSchem, "verifs");