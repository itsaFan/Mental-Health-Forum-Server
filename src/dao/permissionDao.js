const Permission = require("../models/permission");

const assignUserRole = async () => {
  return Permission.findOne({ role: "ROLE_USER" });
};

module.exports = {
  assignUserRole,
};
