const Forum = require("../models/forum");
const Post = require("../models/post");
const User = require("../models/user");

const getAndCreateForumId = async () => {
  const lastForum = await Forum.findOne().sort({
    forumId: -1,
  });

  if (lastForum) {
    return lastForum.forumId + 1;
  } else {
    return 1;
  }
};

const saveForum = async (forumData) => {
  const newForum = new Forum(forumData);
  await newForum.save();
  return newForum;
};

const getAllForums = async () => {
  return Forum.find();
};

const findForumById = async (forumId) => {
  return Forum.findById({ _id: forumId });
};

const countForums = async () => {
  const totalMembers = await User.countDocuments();
  const totalPosts = await Post.countDocuments();
  const totalCommentsResult = await Post.aggregate([{ $unwind: "$comments" }, { $group: { _id: null, totalComments: { $sum: 1 } } }]);
  
  const totalComments = totalCommentsResult.length > 0 ? totalCommentsResult[0].totalComments : 0;

  const statistics = {
    totalMembers,
    totalPosts,
    totalComments,
  };

  return statistics;
};

module.exports = {
  getAndCreateForumId,
  saveForum,
  getAllForums,
  findForumById,
  countForums,
};
