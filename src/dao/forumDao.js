const Forum = require("../models/forum");

const getAndCreateForumId = async () => {
  const lastForum = await Forum.findOne().sort({
    forumId: -1,
  });

  if (lastForum) {
    return lastForum.forumId + 1;
  } else {
    return 1;
  }
};

const saveForum = async (forumData) => {
  const newForum = new Forum(forumData);
  await newForum.save();
  return newForum;
};

const getAllForums = async () => {
  return Forum.find();
};

const findForumById = async (forumId) => {
  return Forum.findById({ _id: forumId });
};

module.exports = {
  getAndCreateForumId,
  saveForum,
  getAllForums,
  findForumById,
};
