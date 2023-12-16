const forumDao = require("../dao/forumDao");

const createForum = async (req, res) => {
  const { title, description, category } = req.body;

  try {
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    const forumId = await forumDao.getAndCreateForumId();

    const forum = await forumDao.saveForum({ forumId, title, description, category });

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

const viewForumStatistics = async (req, res) => {
  try {
    const stats = await forumDao.countForums()
    return res.status(200).json({ message: "Statistics", stats});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when trying to fetch statistics" });
  }
};

module.exports = {
  createForum,
  viewAllForums,
  viewForumStatistics,
};
