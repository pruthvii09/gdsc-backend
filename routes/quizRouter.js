const express = require('express');
const {
  getQuizesByCategory,
  addQuizes,
} = require('../controllers/quizController');

const router = express.Router();

router.get('/:category', getQuizesByCategory);
router.post('/', addQuizes);

module.exports = router;
