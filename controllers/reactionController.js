const mongoose = require("mongoose");
const Thought = require("./../models/ThoughtModel");
const AppError = require("./../errors/appError");
const asyncWrapper = require("./../utils/asyncWrapper");

exports.createReactions = asyncWrapper(async (req, res) => {
  const { id: thoughtId } = req.params;
  const { username, reactionBody } = req.body;

  if (!username || !reactionBody) {
    throw new AppError("Please provide username and reactionBody fields", 400);
  }

  const thought = await Thought.findById(thoughtId);

  if (!thought) {
    throw new AppError(`Thought with id ${thoughtId} not found`, 404);
  }

  thought.reactions.push({ username, reactionBody });
  await thought.save();

  res.status(200).json({
    status: "success",
    thought,
  });
});

exports.deleteReaction = asyncWrapper(async (req, res) => {
  const { id: thoughtId, reactionId } = req.params;

  const thought = await Thought.findById(thoughtId);

  if (!thought) {
    throw new AppError(`Thought with id ${thoughtId} not found`, 404);
  }

  await Thought.updateOne(
    { _id: thoughtId },
    { $pull: { reactions: { _id: reactionId } } }
  );

  res.status(204).json({
    status: "success",
  });
});
