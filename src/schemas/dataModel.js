const { Schema, model } = require('mongoose');

const dataSchema = new Schema({
  name: String,
  value: String,
  date: Date
});

module.exports = model('Data', dataSchema, "datas");