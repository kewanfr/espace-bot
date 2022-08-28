const { Schema, model } = require('mongoose');

const presentationSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userID: String,
  guildID: String,
  status: String,

  age: String,
  prenom: String,
  localisation: String,
  desc_physique: String,
  hobbies: String,
  desc_perso: String,

  instagram: String,
  twitter: String,
  snapchat: String,

  messageId: String,

  gender: [String],
  orientation: [String],
  pronoms: [String],
  search: [String],
  region: String,
  statut: [String],
});

module.exports = model('Presentation', presentationSchema, "presentations");