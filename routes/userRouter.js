const express = require('express');

const {
  getSingleProfile,
  signup,
  login,
  categorySelect,
  userCategories,
  quizAttempt,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/:id', authMiddleware, getSingleProfile);
router.post('/signup', signup);
router.post('/login', login);
router.post('/quizCategory', categorySelect);
router.post('/quizAttempt', userCategories);
router.get('/quizAttempt/:category', quizAttempt);

module.exports = router;
