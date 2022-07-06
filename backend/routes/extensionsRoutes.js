const express = require ('express');
const extensionsControllers = require('../controllers/extensionsControllers')
const router = express.Router();

router.route("/")
.get(extensionsControllers.getAllExtensions)

module.exports = router;