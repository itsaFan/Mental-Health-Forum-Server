const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema({
  forumId: {
    type: String,
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
});

const Forum = mongoose.model("Forum", forumSchema);
module.exports = Forum;
