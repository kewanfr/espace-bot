const { Schema, model } = require('mongoose');

const warnsSchema = new Schema({
  guildID: String,
  userID: String,
  userTag: String,
  // reason: String,
  // type: String,
  content: Array,
  // date: Date,

});

module.exports = model('Warn', warnsSchema, "warns");