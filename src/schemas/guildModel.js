const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
  _id: Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  guildIcon: { type: String },
});

module.exports = model('Guild', guildSchema, "guilds");