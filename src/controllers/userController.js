const userDao = require("../dao/userDao");
const permissionDao = require("../dao/permissionDao")

const getAllUsers = async (req, res) => {
  try {
    const users = await userDao.getAllUsers();
    res.json({ message: "Successfully retrieved all users", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error when fetching users" });
  }
};

const getAllRole = async (req, res) => {
    try{
        const role = await permissionDao.getAllRole();
        res.json({message: "Successfully retrived all roles", role});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Error fetching role"})
    }
};

const updateUserRole = async (req, res) => {
    const {userId, newRoleId} = req.params

    try{
        const updateUser = await userDao.updateUserRole(userId, newRoleId)

        if(!updateUser){
            return res.status(404).json({message: "User not found"});
        }

        res.json({
            message: "User role updated!!",
            updateUser,
        });
    } catch (error){
        consol.error(error);
        res.status(500).json({message: "Error updating user role"})
    }
}

module.exports = {
  getAllUsers,
  getAllRole,
  updateUserRole
};
