const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");
const passport = require("passport");
const { ensureGuest } = require("../middleware/auth");

//TASK 1 : 메인화면
router.route("/").get(ensureGuest, auth.mainPage);

// TASK 2 : 회원가입

router.route("/signup").post(auth.registerDirect);
router.route("/google").get(auth.googleLogin);
router.route("/login").get(auth.loginPage).post(auth.login);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/api");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/api");
  });
});

module.exports = router;
