const Post = require("../models/post");

const savePost = async (postData) => {
  const newPost = new Post(postData);
  await newPost.save();
  return newPost;
};

const getPostById = async (_id) => {
  return Post.findById({ _id }).populate("author", "username");
};

const updatePost = async (postId, updateData) => {
  const updatingPost = await Post.findByIdAndUpdate({ _id: postId }, updateData, { new: true, runValidators: true });
  return updatingPost;
};

const getAllPosts = async () => {
  return Post.find().populate("author", "username").populate("forum", "forumId title description");
};

const getPostsByForumId = async (forumId) => {
  return Post.find({ forum: forumId });
};

module.exports = {
  savePost,
  getPostById,
  updatePost,
  getAllPosts,
  getPostById,
  getPostsByForumId
};
