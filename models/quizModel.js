const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  quizzes: [
    {
      quizNo: { type: Number, required: true },
      question: { type: String, required: true },
      options: [String],
      answers: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model('Quiz', quizSchema);
