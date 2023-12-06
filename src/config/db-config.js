const mongoose = require("mongoose");
const config = require("./config");
const Permission = require("../models/permission");

async function seedPermission() {
  try {
    const roles = ["ROLE_USER", "ROLE_ADMIN", "ROLE_MODERATOR"];
    for (const role of roles) {
      const existingRole = await Permission.findOne({ role: role });
      if (!existingRole) {
        const createNewRole = new Permission({ role: role });
        await createNewRole.save();
      }
    }
  } catch (error) {
    console.error("Error seeding for permission document:", error);
  }
}

const dbConnection = () => {
    mongoose
      .connect(config.mongoUri, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Successfully connect to MongoDb");
        seedPermission();
      })
      .catch((err) => {
        console.error(err);
      });
  };

module.exports = dbConnection;
