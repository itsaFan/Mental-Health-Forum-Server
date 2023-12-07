const Permission = require("../models/permission");

const assignUserRole = async () => {
  return Permission.findOne({ role: "ROLE_USER" });
};

const getAllRole = async () => {
  return Permission.find()
}

module.exports = {
  assignUserRole,
  getAllRole
};
