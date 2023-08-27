const mongoose = require("mongoose");
const { Schema } = mongoose;

const reactionSchema = new Schema({
  reactionBody: {
    type: String,
    required: [true, "Reaction must have a body text"],
    maxlength: 280,
  },
  username: {
    type: String,
    required: [true, "Pleaser provide name of reaction creator"],
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now(),
    get: function (timestamp) {
      return timestamp.toLocalString();
    },
  },
});

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: [true, "Please provide thought text"],
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Please provide name of thought creator"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reactions: [reactionSchema],
    createdAt: {
      type: Schema.Types.Date,
      default: Date.now(),
      get: function (timestamp) {
        return timestamp.toLocaleString();
      },
    },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = mongoose.model("Thought", ThoughtSchema);

module.exports = Thought;
