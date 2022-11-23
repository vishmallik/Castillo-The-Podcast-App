const express = require("express");
const auth = require("../middlewares/auth");
const Podcast = require("../models/podcast");
const router = express.Router();

router.get("/", (req, res, next) => {
  let success = req.flash("success");
  let success_user = req.flash("success_user");
  if (req.user) {
    if (req.user.type == "Free") {
      Podcast.find({ type: "Free", isVerified: true }, (err, podcasts) => {
        if (err) return next(err);
        return res.render("podcasts", { podcasts, success, success_user });
      });
    }
    if (req.user.type == "VIP") {
      Podcast.find(
        { type: { $in: ["Free", "VIP"] }, isVerified: true },
        (err, podcasts) => {
          if (err) return next(err);
          return res.render("podcasts", { podcasts, success, success_user });
        }
      );
    }
    if (req.user.type == "Premium") {
      Podcast.find(
        { type: { $in: ["Free", "VIP", "Premium"] }, isVerified: true },
        (err, podcasts) => {
          if (err) return next(err);
          return res.render("podcasts", { podcasts, success, success_user });
        }
      );
    }
  } else {
    res.redirect("/");
  }
});

router.post("/", (req, res, next) => {
  if (req.user.admin) {
    req.body.isVerified = true;
  }
  req.body.featuring = req.body.featuring
    .trim()
    .split(",")
    .reduce((acc, elm) => {
      acc.push(elm.trim());
      return acc;
    }, []);
  Podcast.create(req.body, (err, podcast) => {
    if (err) return next(err);
    if (!req.user.admin) {
      req.flash(
        "success_user",
        "Podcast submitted successfully. Sent for verification to admin"
      );
    }
    res.redirect("/podcasts");
  });
});

router.get("/new", (req, res, next) => {
  res.render("addPodcast");
});

router.use(auth.isAdmin);

router.get("/:podcastId/edit", (req, res, next) => {
  let podcastId = req.params.podcastId;
  Podcast.findById(podcastId, (err, podcast) => {
    if (err) return next(err);
    res.render("editPodcast", { podcast });
  });
});

router.get("/:podcastId/delete", (req, res, next) => {
  let podcastId = req.params.podcastId;
  Podcast.findByIdAndDelete(podcastId, (err, podcast) => {
    if (err) return next(err);
    req.flash("success", "Deleted successfully");
    res.redirect("/podcasts");
  });
});

router.get("/verify", (req, res, next) => {
  let success = req.flash("success");
  Podcast.find({ isVerified: false }, (err, podcasts) => {
    if (err) return next(err);
    res.render("podcasts", { podcasts, success, success_user: "" });
  });
});

router.get("/:podcastId/verify", (req, res, next) => {
  let podcastId = req.params.podcastId;
  Podcast.findByIdAndUpdate(
    podcastId,
    { isVerified: true },
    (err, podcasts) => {
      if (err) return next(err);
      req.flash("success", "Podcast Verified!!");
      res.redirect("/podcasts/verify");
    }
  );
});

router.post("/:podcastId", (req, res, next) => {
  let podcastId = req.params.podcastId;
  req.body.featuring = req.body.featuring
    .trim()
    .split(",")
    .reduce((acc, elm) => {
      acc.push(elm.trim());
      return acc;
    }, []);
  Podcast.findByIdAndUpdate(podcastId, req.body, (err, podcast) => {
    if (err) return next(err);
    req.flash("success", "Podcast edit successfully");
    res.redirect("/podcasts");
  });
});

module.exports = router;
