const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema({
  forumId: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    enum: ["General-Discussion", "Experiences", "Advices", "Treatment-Suggestion", "Support and Help"],
  },
});

const Forum = mongoose.model("Forum", forumSchema);
module.exports = Forum;
