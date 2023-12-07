const userProfileDao = require("../dao/userProfileDao");

const updateProfile = async (req, res) => {
  const userId = req.userPayload.userId;
  const updateData = req.body;

  try {
    if (updateData.gender !== "Male" && updateData.gender !== "Female") {
      return res.status(400).json({ message: "Gender needs to be either Male or Female" });
    }

    const updatedUserProfile = await userProfileDao.updateUserProfile(userId, updateData);

    if (!updatedUserProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(201).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when updating user profile" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userPayload?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - User ID not provided" });
    }

    const userProfile = await userProfileDao.getUserProfile(userId);
    console.log(userProfile);

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found", userId: userId });
    }

    const profileData = {
      userId: userProfile.userId,
      gender: userProfile.gender || "",
      country: userProfile.country || "",
      address: userProfile.address || "",
      followers: userProfile.followers,
      following: userProfile.following,
      bio: userProfile.bio || "",
      assessmentResult: userProfile.assessmentResult || "",
      profileImgUrl: userProfile.profileImgUrl || "",
      status: userProfile.status,
    };

    res.status(200).json({ message: "User profile retrieved successfully", userProfile: profileData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when retrieving user profile" });
  }
};

module.exports = {
  updateProfile,
  getUserProfile,
};
