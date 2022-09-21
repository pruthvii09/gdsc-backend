const express = require('express');

const { signup, login, categorySelect, quizAttempt } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post("/quizCategory",categorySelect);
router.get("/quizAttempt",quizAttempt)

module.exports = router;
