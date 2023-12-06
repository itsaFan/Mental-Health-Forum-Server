const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission"
    }
})


const User = mongoose.model("User", userSchema);
module.exports = User;