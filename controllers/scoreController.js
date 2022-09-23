const Score = require('../models/scoreModel');
const User = require('../models/userModel');

const getScoreByCategory = async (req, res) => {
  const { category } = req.params;

  const scores = await Score.findOne({ category: category });
  res.status(200).json(scores);
};

// Add score
const addScoreByCategory = async (req, res) => {
  //   const score = await Score.create({ category: category });
  //   console.log(category);
  const { category } = req.params;
  const { id, name, score } = req.body;

  console.log(category);

  //   const find = await Score.findOne({ category: category });
  //   console.log(find);

  const addScore = await Score.updateOne(
    { category: category },
    {
      $push: {
        attende: {
          id,
          name,
          score,
        },
      },
    }
  );

  if (addScore) {
    return res.status(200).json({
      message: `added`,
    });
  }

  return res.status(400).json({ error: '' });
};

const checkExamAlreadyGive = async (req, res) => {
  const { category } = req.query;
  const { id } = req.params;

  console.log('HELLO ALL', category, id);

  const containCategory = await User.findOne({ _id: id });

  console.log(category);

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

module.exports = {
  getScoreByCategory,
  addScoreByCategory,
  checkExamAlreadyGive,
  checkLive,
};
