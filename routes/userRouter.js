const express = require('express');

const {
  getSingleProfile,
  signup,
  login,
  forgetPassword,
  updatePassword,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/:id', authMiddleware, getSingleProfile);
router.post('/signup', signup);
router.post('/login', login);
router.post('/forget', forgetPassword);
router.patch('/:id', updatePassword);

//
// router.post('/quizCategory', categorySelect);
// router.post('/quizAttempt', userCategories);
// router.get('/quizAttempt/:category', quizAttempt);

module.exports = router;
