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

const deletePost = async (postId, userId, userRole) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if the user is the owner, moderator, or admin of the post
    if (
      post.author.toString() !== userId &&
      userRole !== "ROLE_MODERATOR" &&
      userRole !== "ROLE_ADMIN"
    ) {
      throw new Error("User is not authorized to delete this post");
    }

    // Perform the delete operation using deleteOne
    await Post.deleteOne({ _id: postId });

    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  savePost,
  getPostById,
  updatePost,
  getAllPosts,
};
