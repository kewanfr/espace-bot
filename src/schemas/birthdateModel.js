const { Schema, model } = require('mongoose');

const birthdateSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userID: String,
  guildID: String,
  birthdate: Date,
  day: String,
  month: String,
  year: String,
  birthdayMsg: Boolean,
});

module.exports = model('Birthdate', birthdateSchema, "birthdates");