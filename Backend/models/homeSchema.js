// /models/homeSchema.js
const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
   _id: String,
  heading: String,
  text: String
});

module.exports = mongoose.model('HomeContent', homeSchema);
