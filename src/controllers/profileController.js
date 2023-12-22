const userProfileDao = require("../dao/userProfileDao");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const UserProfile = require("../models/profile");


// TODO: Move this configuration to a separate module/folder
const storage = new Storage({
  projectId: "final-project-408610",
  keyFilename: ".keyfile.json", // create keyfile.json file from json file in Slack
});

const bucketName = "final-project-revou";
const bucket = storage.bucket(bucketName);

const updateProfile = async (req, res) => {
  const userId = req.userPayload.userId;
  const updateData = req.body;

  try {
    // Validate gender upfront
    if (
      updateData.gender &&
      updateData.gender !== "Male" &&
      updateData.gender !== "Female"
    ) {
      return res
        .status(400)
        .json({ message: "Gender needs to be either Male or Female" });
    }

    if (!req.file) {
      // Update only gender
      const updatedUserProfile = await userProfileDao.updateUserProfile(
        userId,
        updateData
      );

      if (!updatedUserProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      res.status(201).json({ message: "User profile updated successfully" });
      return; // Exit early to avoid unnecessary file upload logic
    }

    // Update both gender and profile image
    const file = req.file;
    const fileName = `${userId}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimeType,
      },
    });

    blobStream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ message: "Error uploading file" });
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

      // Update both profileImgUrl and other fields in one database operation
      const updatedUserProfile = await UserProfile.findByIdAndUpdate(userId, {
        profileImgUrl: publicUrl,
        ...updateData,
      });

      if (!updatedUserProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      res.status(201).json({ message: "User profile updated successfully" });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when updating user profile" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userPayload.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User ID not provided" });
    }

    const userProfile = await userProfileDao.getUserProfile(userId);
    // console.log(userProfile);

    if (!userProfile) {
      return res
        .status(404)
        .json({ message: "User profile not found", ownerId: userId });
    }

    const profileData = {
      profileOwner: userProfile.profileOwner,
      gender: userProfile.gender || "",
      country: userProfile.country || "",
      address: userProfile.address || "",
      followers: userProfile.followers,
      following: userProfile.following,
      bio: userProfile.bio || "",
      assessmentResult: userProfile.assessmentResult || "",
      profileImgUrl: userProfile.profileImgUrl || "",
      status: userProfile.status,
      createdOn: userProfile.createdOn,
    };

    res.status(200).json({
      message: "User profile retrieved successfully",
      userProfile: profileData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when retrieving user profile" });
  }
};

const getUserProfileById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userProfile = await userProfileDao.getUserProfileById(userId);

    if (!userProfile) {
      return res
        .status(404)
        .json({ message: "User profile not found", userId: userId });
    }

    const formattedProfile = {
      profileOwner: userProfile.profileOwner,
      gender: userProfile.gender || "",
      country: userProfile.country || "",
      address: userProfile.address || "",
      followers: userProfile.followers,
      following: userProfile.following,
      bio: userProfile.bio || "",
      assessmentResult: userProfile.assessmentResult || "",
      profileImgUrl: userProfile.profileImgUrl || "",
      status: userProfile.status,
      createdOn: userProfile.createdOn,
    };

    res.status(200).json({
      message: "User profile retrieved successfully",
      userProfile: formattedProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when retrieving user profile" });
  }
};

module.exports = {
  updateProfile,
  getUserProfile,
  getUserProfileById,
};
