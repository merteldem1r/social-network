const Thought = require("./../models/ThoughtModel");
const User = require("./../models/UserModel");
const asyncWrapper = require("./../utils/asyncWrapper");
const AppError = require("./../errors/appError");

exports.checkThoughtAuthor = asyncWrapper(async (req, res, next) => {
  const { id: thoughtId } = req.params;
  const { userId } = req.body;
  const thought = await Thought.findById(thoughtId);

  if (!thought) {
    throw new AppError(`Thought with id ${thoughtId} not found`, 404);
  }

  if (thought.userId != userId) {
    throw new AppError("You can not delete or update other user thoughts", 401);
  }

  next();
});

exports.getAllThoughts = asyncWrapper(async (req, res) => {
  const thoughts = await Thought.find({});

  res.status(200).json({
    status: "success",
    results: thoughts.length,
    thoughts,
  });
});

exports.getThought = asyncWrapper(async (req, res) => {
  const { id: thoughtId } = req.params;
  const thought = await Thought.findById(thoughtId);

  if (!thought) {
    throw new AppError(`Thought with id ${thoughtId} not found`, 404);
  }

  res.status(200).json({
    status: "success",
    thought,
  });
});

exports.createThought = asyncWrapper(async (req, res) => {
  const { thoughtText, userId } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(`User not found with id: ${userId}`, 404);
  }

  const thought = await Thought.create({
    thoughtText,
    username: user.username,
    userId,
  });

  await User.updateOne({ _id: userId }, { $push: { thoughts: thought._id } });

  res.status(200).json({
    status: "success",
    thought,
  });
});

exports.updateThought = asyncWrapper(async (req, res) => {
  const { id: thoughtId } = req.params;
  const { thoughtText } = req.body;

  if (!thoughtText || Object.keys(req.body).length > 2) {
    throw new AppError("Please provide just thoughtText and userId field", 400);
  }

  const thought = await Thought.findByIdAndUpdate(
    thoughtId,
    { thoughtText },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    thought,
  });
});

exports.deleteThought = asyncWrapper(async (req, res) => {
  const { id: thoughtId } = req.params;
  const thought = await Thought.findById(thoughtId);

  await User.updateOne(
    { _id: thought.userId },
    { $pull: { thoughts: thoughtId } }
  );

  await thought.deleteOne();

  res.status(204).json({
    status: "success",
  });
});
