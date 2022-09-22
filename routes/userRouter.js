const express = require('express');

const {
  signup,
  login,
  categorySelect,
  userCategories,
  quizAttempt,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/quizCategory', categorySelect);
router.post('/quizAttempt', userCategories);
router.get('/quizAttempt/:category', quizAttempt);

module.exports = router;
