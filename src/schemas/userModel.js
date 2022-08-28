const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userID: String,
  guildID: String,
  username: String,
  discriminator: String,
  nickname: String,
  avatar: String,
  roles: [String],
  joinedAt: Date,

  birthdate: Date,
  age: Number,
  gender: [String],
  orientation: [String],
  pronoms: [String],
  search: [String],
  region: String,
  statut: [String],
  
  // Custom
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  messages: { type: Number, default: 0 },
});

module.exports = model('User', userSchema, "users");