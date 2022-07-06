const { callbackPromise } = require("nodemailer/lib/shared");
const PostUsers = require("../models/Users");

exports.getAllUsers = async (req, res, next) => {
  try {
    console.log("getAllUsers!");
    const [users, _] = await PostUsers.findAll();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};


