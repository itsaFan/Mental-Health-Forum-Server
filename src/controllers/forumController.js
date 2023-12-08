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

const viewAllForums = async (req, res) => {
  try {
    const forums = await forumDao.getAllForums();
    return res.status(200).json({ message: "All Forums: ", forums });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to fetch all forums" });
  }
};

module.exports = {
  createForum,
  viewAllForums,
};
