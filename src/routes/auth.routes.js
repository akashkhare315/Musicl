const express = require("express");
const router = express.Router();
const registerController = require("../controllers/auth.controller");
const {registerValidationRules} = require("../middleware/validation.middleware")

router.post("/register", registerValidationRules, registerController.register);

module.exports = router;
