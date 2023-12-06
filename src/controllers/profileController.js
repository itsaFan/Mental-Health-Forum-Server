const userProfileDao = require("../dao/userProfileDao")

const updateUserProfile = async (req, res) =>{
    const userId = req.params.userId;
    const updateData = req.body;

    try{
        const updatedUserProfile = await userProfileDao.updateUserProfile(userId, updateData);

        if (!updateUserProfile){
            return res.status(404).json({message: "User Profile not Found" });

        }
        res.json({message: "User Profile updated success!", userProfile: updateUserProfile});
    }catch (error){
        console.error(error);
        res.status(500).json({message:"Error when updating user profile"});
    }
};

module.exports = {
    updateProfile
}