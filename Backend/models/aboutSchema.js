// models/aboutSchema.js
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, required: true }, 
  description: { type: String, required: true }
});

const aboutSchema = new mongoose.Schema({
  heading: { type: String, required: true }, 
  text: { type: String, required: true },    
  image: { type: String },                   
  skills: [skillSchema]                      
});

module.exports = mongoose.model('aboutContent', aboutSchema);

