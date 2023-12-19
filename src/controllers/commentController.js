const postDao = require("../dao/postDao");
const { getIoInstance } = require("../middlewares/socket");

const commentToPost = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const commenter = req.userPayload.userId;

  try {
    if (!text) {
      return res.status(400).json({
        message: "text field is required",
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
    const io = getIoInstance();
    io.emit("commentCreated");

    res.status(201).json({
      message: "Comment added successfully",
      comments: post.comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to create comment" });
  }
};

const editOwnComment = async (req, res) => {
  const { postId } = req.params;
  const { commentId, text } = req.body;
  const userId = req.userPayload.userId;

  try {
    const post = await postDao.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!commentId || !text) {
      return res.status(400).json({
        message: "commentId & text field is required",
      });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.commenter._id.toString() !== userId) {
      return res.status(403).json({ message: "Only the commenter can edit own's comment" });
    }

    comment.text = text;
    await post.save();

    res.status(200).json({ message: "Edit comment success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to edit comment" });
  }
};

const deleteOwnComment = async (req, res) => {
  const { postId } = req.params;
  const { commentId } = req.body;
  const userId = req.userPayload.userId;

  try {
    const post = await postDao.getPostById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    } else if (!commentId) {
      return res.status(400).json({
        message: "commentId  field is required",
      });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.commenter._id.toString() !== userId) {
      return res.status(403).json({ message: "Only the commenter can edit own's comment" });
    }

    comment.deleteOne();
    await post.save();
    res.status(200).json({ message: "Delete comment success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to delete comment" });
  }
};

module.exports = {
  commentToPost,
  editOwnComment,
  deleteOwnComment,
};
