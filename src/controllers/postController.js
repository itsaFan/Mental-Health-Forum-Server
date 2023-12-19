const postDao = require("../dao/postDao");
const forumDao = require("../dao/forumDao");
const { getIoInstance } = require("../middlewares/socket");
const Post = require("../models/post");
const User = require("../models/user");

const createPost = async (req, res) => {
  const { forumId, title, content } = req.body;
  const userId = req.userPayload.userId;

  try {
    if (!forumId || !title || !content) {
      return res.status(400).json({ message: "Either forumId, title, content field is missing" });
    }

    if (!userId) {
      return res.status(404).json({ message: "UserId not found on the payload" });
    }

    const forumExist = await forumDao.findForumById(forumId);
    if (!forumExist) {
      return res.status(404).json({ message: "Forum not found" });
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

    const io = getIoInstance();
    io.emit("postCreated");
    // io.emit('newPost', newPost);

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

const viewPostsByForum = async (req, res) => {
  const { forumId } = req.params;
  try {
    if (!forumId) {
      return res.status(400).json({ message: "forumId is required in the params" });
    }
    const posts = await postDao.getPostsByForumId(forumId);
    return res.status(200).json({ message: "Posts by forum", posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to fetch posts by forum._id" });
  }
};

const viewPostById = async (req, res) => {
  const { postId } = req.params;
  const commentPage = parseInt(req.query.commentPage) || 1;
  const limit = 9;
  const commentSkip = (commentPage - 1) * limit;

  try {
    const post = await postDao.getPostById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const paginatedComments = post.comments.slice(commentSkip, commentSkip + limit);
    const populatedComments = await Promise.all(
      paginatedComments.map(async (comment) => {
        const commenter = await User.findById(comment.commenter).select("username");
        return { ...comment.toObject(), commenter };
      })
    );

    return res.status(200).json({
      message: "Post: ",
      post: { ...post.toObject(), comments: populatedComments },
      commentPage,
      totalCommentPages: Math.ceil(post.comments.length / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to fetch posts" });
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

const viewTopTenPosts = async (req, res) => {
  try {
    const posts = await postDao.getTopTenPosts();
    return res.status(200).json({ message: "Top 10 Posts: ", posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to fetch 10 most posts" });
  }
};

const viewPaginatedPosts = async (req, res) => {
  const { forumId } = req.params;
  const page = parseInt(req.query.page);
  const limit = 20;
  const skipIndex = (page - 1) * limit;

  try {
    if (!forumId) {
      return res.status(400).json({ message: "forumId is required in the params" });
    }
    const totalPosts = await postDao.countPostsBasedOnForum(forumId);
    let posts = await postDao.getPaginatedPosts(forumId, limit, skipIndex);

    posts = posts.map((post) => {
      const totalComments = post.comments.length;

      if (totalComments > 0) {
        post.comments.sort((a, b) => b.createdAt - a.createdAt);
        post.comments = [post.comments[0]];
      }

      return {
        ...post.toObject(),
        totalComments,
      };
    });
    return res.status(200).json({
      posts: posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to fetch posts" });
  }
};

module.exports = {
  createPost,
  editPost,
  viewPostsByForum,
  viewPostById,
  deletePost,
  viewTopTenPosts,
  viewPaginatedPosts,
};
