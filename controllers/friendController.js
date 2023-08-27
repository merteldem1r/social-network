const User = require("./../models/UserModel");
const asyncWrapper = require("./../utils/asyncWrapper");
const AppError = require("./../errors/appError");

exports.addFriend = asyncWrapper(async (req, res) => {
  const { id: userId, friendId } = req.params;

  if (!userId || !friendId || userId === friendId) {
    throw new AppError(`Please provide valid User Id and Friend Id`, 400);
  }

  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    throw new AppError("No user or friend found", 404);
  }

  if (user.friends.includes(friendId)) {
    throw new AppError(`You are already friends with: ${friendId}`, 400);
  }

  user.friends.push(friendId);
  await user.save();

  friend.friends.push(userId);
  await friend.save();

  res.status(201).json({
    status: "success",
    user,
  });
});

exports.deleteFriend = asyncWrapper(async (req, res) => {
  const { id: userId, friendId } = req.params;

  if (!userId || !friendId || userId === friendId) {
    throw new AppError(`Please provide valid User Id and Friend Id`, 400);
  }

  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    throw new AppError("No user or friend found", 404);
  }

  if (!user.friends.includes(friendId)) {
    throw new AppError(`You are already not friends with: ${friendId}`, 400);
  }

  // delete friendId from user friends array
  await User.updateOne({ _id: userId }, { $pull: { friends: friendId } });

  // delete userId from friend friends array
  await User.updateOne({ _id: friendId }, { $pull: { friends: userId } });

  res.status(204).json({
    status: "success",
    user,
  });
});
