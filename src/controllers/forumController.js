const forumDao = require("../dao/forumDao");

const createForum = async (req, res) => {
  const { title, description } = req.body;

  try {
    const forumId = await forumDao.getAndCreateForumId();

    const forum = await forumDao.saveForum({ forumId, title, description });

    return res.status(201).json({ message: "Forum created successfully: ", forum });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to create forum" });
  }
};

module.exports = {
  createForum,
};
