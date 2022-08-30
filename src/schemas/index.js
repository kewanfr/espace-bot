const BirthdateModel = require('./birthdateModel');
const UserModel = require('./userModel');
const GuildModel = require('./guildModel');
const PresentationModel = require('./presentationModel');
const warnsModel = require('./warnsModel');
const mongoose  = require('mongoose');

module.exports = {
  BirthdateModel,
  UserModel,
  GuildModel,
  PresentationModel,
  warnsModel,
  mongoose,
}