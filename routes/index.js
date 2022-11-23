var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  let error = req.flash("error");
  let success = req.flash("success");
  res.render("index", { error, success });
});

module.exports = router;
