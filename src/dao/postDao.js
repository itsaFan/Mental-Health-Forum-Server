const Post = require("../models/post");
const User = require("../models/user");

const savePost = async (postData) => {
  const newPost = new Post(postData);
  await newPost.save();
  return newPost;
};

// const getPostById = async (_id) => {
//   return Post.findById({ _id }).populate("author", "username").populate("forum", "title").populate("comments.commenter", "username");
// };

const getPostById = async (_id) => {
  return Post.findById(_id).populate("author", "username").populate("forum", "title");
};

const updatePost = async (postId, updateData) => {
  const updatingPost = await Post.findByIdAndUpdate({ _id: postId }, updateData, { new: true, runValidators: true });
  return updatingPost;
};

const getAllPosts = async () => {
  return Post.find().populate("author", "username").populate("forum", "forumId title description");
};

const getPostsByForumId = async (forumId) => {
  return Post.find({ forum: forumId }, "-comments").populate("author", "username").populate("forum", "forumId title description");
};

const deletePost = async (postId, userId, userRole) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.author.toString() !== userId && userRole !== "ROLE_MODERATOR" && userRole !== "ROLE_ADMIN") {
      throw new Error("User is not authorized to delete this post");
    }

    await Post.deleteOne({ _id: postId });

    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const getTopTenPosts = async () => {
  return Post.find().populate("author", "username").populate("forum", "forumId title description").sort({ createdAt: -1 }).limit(10);
};

const getPaginatedPosts = async (forumId, limit, skipIndex) => {
  return Post.find({ forum: forumId })
    .populate("author", "username")
    .populate("forum", "forumId title description")
    .populate({
      path: "comments.commenter",
      select: "username",
      model: "User",
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skipIndex);
};

const countPostsBasedOnForum = async (forumId) => {
  return Post.countDocuments({ forum: forumId });
};

module.exports = {
  savePost,
  getPostById,
  updatePost,
  getAllPosts,
  getPostsByForumId,
  deletePost,
  getTopTenPosts,
  getPaginatedPosts,
  countPostsBasedOnForum,
};
