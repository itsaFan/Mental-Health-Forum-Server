const postDao = require("../dao/postDao");

const createPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.userPayload.userId;

  try {
    if (!userId) {
      return res.status(404).json({ message: "UserId not found" });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: "Your post is too long, only maximum of 500 characters are allowed" });
    }

    const postData = {
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
  const { content } = req.body;
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

    const edittedPost = await postDao.updatePost(postId, { content });

    return res.status(200).json({ message: "Edit post success", post: edittedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to create post" });
  }
};

module.exports = {
  createPost,
  editPost,
};
