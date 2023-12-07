const { v4: uuidv4 } = require("uuid");

const generateResetPaswToken = () => {
  return uuidv4();
};

module.exports = {
  generateResetPaswToken,
};
