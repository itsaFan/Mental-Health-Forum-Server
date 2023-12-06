const UserProfile = require("../models/userProfile");


const getUserProfile = async (userId) => {
    try {
        const userProfile = await UserProfile.findOne({ userId }).populate("followers").populate("following");
        return userProfile;
    } catch (error) {
        throw error;
    }
};

const updateUserProfile = async (userId, updateData) => {
    try {
        const userProfile = await UserProfile.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate("followers").populate("following");

        return userProfile;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
};
