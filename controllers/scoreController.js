const Score = require('../models/scoreModel');
const User = require('../models/userModel');

const getScoreByCategory = async (req, res) => {
  const { category } = req.params;

  const scores = await Score.findOne({ category: category });

  if (scores.attende.length > 0) {
    const sortByTime = scores.attende.sort(
      (a, b) => a.submittedAt - b.submittedAt
    );
    const sortedByScore = sortByTime.sort((a, b) => b.score - a.score);

    return res.status(200).json(sortedByScore);
  }
  res.status(400).json({ error: 'Could not find score!' });
};

// Add score
const addScoreByCategory = async (req, res) => {
  const { category } = req.params;
  const { id, name, score, submittedAt, year } = req.body;

  const addScore = await Score.updateOne(
    { category: category },
    {
      $push: {
        attende: {
          id,
          name,
          score,
          submittedAt,
          year,
        },
      },
    }
  );

  if (addScore) {
    return res.status(200).json({
      message: `added`,
    });
  }

  res.status(400).json({ error: 'error occured' });
};

const checkExamAlreadyGive = async (req, res) => {
  const { category } = req.query;
  const { id } = req.params;

  const containCategory = await User.findOne({ _id: id });

  if (containCategory) {
    if (containCategory.quizCategory.includes(category)) {
      const user = await Score.findOne({ category: category }).select({
        attende: { $elemMatch: { id: id } },
      });

      if (user?.attende?.length <= 0) {
        return res.status(200).json({ message: 'You can give exam' });
      }
      return res
        .status(400)
        .json({ error: 'You have alreday attempted for exam!' });
    }
    res.status(400).json({ error: "You haven't registered for this category" });
  }
};

// check exam is live or not
const checkLive = async (req, res) => {
  const { category } = req.params;

  const check = await Score.findOne({ category: category, live: true });

  if (check) {
    return res.status(200).json({ message: 'Quiz is live now!' });
  }

  res.status(400).json({
    error: 'Quiz is not live yet!',
    p: 'Please wait till quizzes goes live!',
  });
};

// Get password
const getPassword = async (req, res) => {
  const { category } = req.params;

  const password = await Score.findOne({ category: category }).select(
    'password'
  );

  if (password) {
    return res.status(200).json(password.password);
  }

  res.status(400).json({ error: 'Could not find password' });
};

// add new category
const addCategory = async (req, res) => {
  const { category, live, password, attende } = req.body;

  const newCategory = await Score.create({
    category,
    live,
    password,
    attende,
  });

  if (newCategory) {
    return res.status(200).json({ message: 'Category added!' });
  }

  res.status(400).send({ message: 'Could not add category' });
};

module.exports = {
  getScoreByCategory,
  addScoreByCategory,
  checkExamAlreadyGive,
  checkLive,
  getPassword,
  addCategory,
};
