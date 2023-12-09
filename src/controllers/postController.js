const postDao = require("../dao/postDao");

const createPost = async (req, res) => {
  const { forumId, title, content } = req.body;
  const userId = req.userPayload.userId;

  try {
    if (!userId) {
      return res.status(404).json({ message: "UserId not found" });
    }

    if (!forumId) {
      return res.status(400).json({ message: "forumId field is missing" });
    }

    if (!title || !content) {
      return res.status(400).json({ message: "Both Title and Content is required" });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: "Your post is too long, only maximum of 500 characters are allowed" });
    }

    const postData = {
      forum: forumId,
      title,
      content,
      author: userId,
    };
    const newPost = await postDao.savePost(postData);

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to create post" });
  }
};

const editPost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userPayload.userId;
  const { postId } = req.params;

  try {
    const post = await postDao.getPostById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author._id.toString() !== userId) {
      return res.status(403).json({ message: "Only the creator can edit this post" });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: "Your post is too long, only maximum of 500 characters are allowed" });
    }

    const edittedPost = await postDao.updatePost(postId, { title, content });

    return res.status(200).json({ message: "Edit post success", post: edittedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to create post" });
  }
};

// Depracated
const viewAllPosts = async (req, res) => {
  try {
    const posts = await postDao.getAllPosts();
    return res.status(200).json({ message: "All Posts: ", posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to fetch posts" });
  }
};

const viewPostsByForum = async (req, res) => {
  const { forumId } = req.body;
  try {
    if (!forumId) {
      return res.status(400).json({ message: "forumId is required" });
    }
    const posts = await postDao.getPostsByForumId(forumId);
    return res.status(200).json({ message: "Posts by forum", posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to fetch posts by forum._id" });
  }
};

const deletePost = async (req, res) => {
  const userId = req.userPayload.userId;
  const userRole = req.userPayload.role;
  const { postId } = req.params;

  try {
    const result = await postDao.deletePost(postId, userId, userRole);
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(403).json({ error: result.error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to delete post" });
  }
};

module.exports = {
  createPost,
  editPost,
  viewAllPosts,
  viewPostsByForum,
  deletePost,
};
