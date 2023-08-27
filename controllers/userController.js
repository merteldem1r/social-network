const User = require("./../models/UserModel");
const Thought = require("./../models/ThoughtModel");
const AppError = require("./../errors/appError");
const asyncWrapper = require("./../utils/asyncWrapper");

exports.getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find({})
    .populate({
      path: "friends",
      select: "-email",
    })
    .populate({
      path: "thoughts",
    });

  res.status(200).json({
    status: "success",
    results: users.length,
    users,
  });
});

exports.getUser = asyncWrapper(async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findById(userId)
    .populate({
      path: "friends",
      select: "-email",
    })
    .populate({
      path: "thoughts",
    });

  if (!user) {
    throw new AppError(`No user found with id: ${userId}`, 404);
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.createUser = asyncWrapper(async (req, res) => {
  const { username, email } = req.body;
  const user = await User.create({ username, email });

  res.status(201).json({
    status: "success",
    user,
  });
});

exports.updateUser = asyncWrapper(async (req, res) => {
  const { id: userId } = req.params;
  const { username, email } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { username, email },
    { new: true }
  );

  if (!user) {
    throw new AppError(`No user found with id: ${userId}`, 404);
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.deleteUser = asyncWrapper(async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new AppError(`No user found with id: ${userId}`, 404);
  }

  // remove deleted user id from other users friends array
  await User.updateMany(
    { _id: { $in: user.friends } },
    { $pull: { friends: userId } }
  );

  // delete associate user thought
  await Thought.deleteMany({ userId });

  await res.status(204).json({
    status: "success",
  });
});
