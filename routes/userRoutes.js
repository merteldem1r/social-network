const express = require("express");
const userController = require("../controllers/userController");
const friendController = require("../controllers/friendController");

const router = express.Router();

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route("/:id/friends/:friendId")
  .post(friendController.addFriend)
  .delete(friendController.deleteFriend);

module.exports = router;
