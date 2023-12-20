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

const search = async (query, page, limit = 20) => {
  const matchingUsers = await User.find({ username: { $regex: query, $options: "i" } }).select("_id");
  const userIds = matchingUsers.map((user) => user._id);

  const skip = (page - 1) * limit;

  let postMatch = await Post.find({
    $or: [{ content: { $regex: query, $options: "i" } }, { title: { $regex: query, $options: "i" } }, { author: { $in: userIds } }],
  })
    .populate("author", "username")
    .populate("forum", "forumId title description")
    .populate({
      path: "comments.commenter",
      select: "username",
      model: "User",
    })
    .limit(limit)
    .skip(skip);

  postMatch = postMatch.map((post) => {
    const totalComments = post.comments.length;
    if (post.comments && totalComments > 0) {
      post.comments.sort((a, b) => b.createdAt - a.createdAt);
      post.comments = [post.comments[0]];
    }
    return { ...post.toObject(), totalComments };
  });

  const total = await Post.countDocuments({
    $or: [{ content: { $regex: query, $options: "i" } }, { title: { $regex: query, $options: "i" } }, { author: { $in: userIds } }],
  });

  return {
    posts: postMatch,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalResults: total,
  };
};

module.exports = {
  getAndCreateForumId,
  saveForum,
  getAllForums,
  findForumById,
  countForums,
  search,
};
