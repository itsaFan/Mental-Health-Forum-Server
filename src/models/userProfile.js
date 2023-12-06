const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        
    },
    country: {
        type: String,
        
    },
    address: {
        type: String,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserProfile",
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserProfile",
        },
    ],
    bio: {
        type: String,
    },
    assessmentResult: {
        type: String, 
    },
    profileImgUrl: {
        type: String,
    },
    status: {
        type: String,
        enum: ["Member", "Specialist", "Psychologist"],
    },
});

const userProfile = mongoose.model("UserProfile", userProfileSchema);
module.exports = userProfile;
