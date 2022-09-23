const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    quizzes: [
      {
        id: { type: Number, required: true },
        question: { type: String, required: true },
        options: [String],
        answer: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quiz', quizSchema);
