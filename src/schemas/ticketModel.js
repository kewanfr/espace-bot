const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userID: String,
  guildID: String,
  ticketID: String,
  channelID: String,
  closed: Boolean,
  locked: Boolean,
  type: String,
  reason: String,
  sujet: String,
  description: String,
});

module.exports = model('Ticket', ticketSchema, "tickets");