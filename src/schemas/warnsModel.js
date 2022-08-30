const { Schema, model } = require('mongoose');

const warnSchema = new Schema({
  executorID: String,
  executorTag: String,
  reason: String,
  type: String,
  date: String,
  severity: Number,
  proof: String,
});
  

const warnsSchema = new Schema({
  guildID: String,
  userID: String,
  userTag: String,
  content: [warnSchema],
});

module.exports = model('Warn', warnsSchema, "warns");