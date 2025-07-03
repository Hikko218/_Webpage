const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: 
  { type: String, 
    required: true },
  features:
  { type: [String],   // Array safe as List
    required: true }  
});

module.exports = mongoose.model("Project", projectSchema);
