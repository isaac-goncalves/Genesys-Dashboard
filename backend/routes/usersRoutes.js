const express = require ('express');
const usersControllers = require('../controllers/usersControllers')
const router = express.Router();

router.route("/")
.get(usersControllers.getAllUsers)

module.exports = router;