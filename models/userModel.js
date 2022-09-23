const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    quizCategory: [String],
    score: [
      {
        category: { type: String },
        caregoryScore: { type: Number },
        // submittedAt: {type:Date}
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
