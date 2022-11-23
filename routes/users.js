var express = require("express");
const User = require("../models/user");
var router = express.Router();

/* GET users listing. */
router.post("/register", (req, res, next) => {
  let { email, password } = req.body;
  if (!email && !password) {
    req.flash("error", "Email/Password cannot be left blank");
    return res.redirect("/");
  }
  User.create(req.body, (err, user) => {
    if (err) {
      if (err.code == 11000) {
        req.flash("error", "User is already registered. Please Login");
        return res.redirect("/");
      }
      if (err.name == "ValidationError") {
        req.flash("error", "Password should be more than 5 characters long!");
        return res.redirect("/");
      }
      return next(err);
    }
    req.flash("success", "User successfully registered. Please login");
    return res.redirect("/");
  });
});

router.post("/login", (req, res, next) => {
  let { email, password } = req.body;
  if (!email && !password) {
    req.flash("error", "Email/Password cannot be left blank");
    return res.redirect("/");
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "User not found. Please Register first.");
      return res.redirect("/");
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash("error", "Password is Wrong. Please Try Again");
        return res.redirect("/");
      }
      req.session.userId = user.id;

      return res.redirect("/podcasts");
    });
  });
});

router.get("/admin", (req, res, next) => {
  let error = req.flash("error");
  let success = req.flash("success");
  res.render("admin", { error, success });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  return res.redirect("/");
});

module.exports = router;
