const PostExtensions = require("../models/Extensions")

exports.getAllExtensions = async (req, res, next) => {
  try {
    console.log("getAllExtensions!");
    const [extensions, _] = await PostExtensions.findExtensions();
    res.status(200).json({ extensions });
  } catch (error) {
    next(error);
  }
};


