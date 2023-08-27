const express = require("express");
const thoughtController = require("./../controllers/thoughtController");
const reactionController = require("./../controllers/reactionController");

const router = express.Router();

// major thought routes
router
  .route("/")
  .get(thoughtController.getAllThoughts)
  .post(thoughtController.createThought);

router
  .route("/:id")
  .get(thoughtController.checkThoughtAuthor, thoughtController.getThought)
  .delete(thoughtController.checkThoughtAuthor, thoughtController.deleteThought)
  .patch(thoughtController.checkThoughtAuthor, thoughtController.updateThought);

// reaction routes
router.route("/:id/reactions").post(reactionController.createReactions);

router
  .route("/:id/reactions/:reactionId")
  .delete(reactionController.deleteReaction);

module.exports = router;
