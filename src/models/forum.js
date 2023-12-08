const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema({
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
