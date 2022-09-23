const Quiz = require('../models/quizModel');

//
const getQuizesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const quizzes = await Quiz.findOne({ category: category });

    if (quizzes) {
      return res.status(200).json(quizzes);
    }

    res.status(400).json({ message: 'No such category' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addQuizes = async (req, res) => {
  const { category, quizzes } = req.body;

  try {
    const cat = await Quiz.create({
      category,
      quizzes,
    });

    res.status(200).json(cat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getQuizesByCategory, addQuizes };
