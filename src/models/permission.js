const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["ROLE_USER", "ROLE_ADMIN", "ROLE_MODERATOR"],
  },
});

const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;
