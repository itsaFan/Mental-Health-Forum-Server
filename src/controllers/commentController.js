const postDao = require("../dao/postDao");

const commentToPost = async (req, res) => {
  const { postId, text } = req.body;
  const commenter = req.userPayload.userId;

  try {
    if (!postId || !text) {
      return res.status(400).json({
        message: "postId or text field is required",
      });
    }
    const post = await postDao.getPostById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const newComment = { text, commenter };
    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      message: "Comment added successfully",
      comments: post.comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to create comment" });
  }
};

module.exports = {
  commentToPost,
};
