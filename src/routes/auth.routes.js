// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const registerController = require("../controllers/auth.controller");
// const {
//   registerValidationRules,
// } = require("../middleware/validation.middleware");

// router.post("/register", registerValidationRules, registerController.register);

// // Route to initiate Google OAuth flow
// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // Callback route that Google will redirect to after authentication
// router.get(
//   "/api/auth/google/callback",
//   passport.authenticate("google", { session: false }),
//   authcontroller.googleAuthcallback
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller.js");
const {
  registerValidationRules,
} = require("../middleware/validation.middleware");

// normal register route
router.post("/register", registerValidationRules, authController.register);

// start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
   authController.googleAuthcallback
);

module.exports = router;
