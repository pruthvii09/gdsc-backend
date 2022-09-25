const express = require('express');

const {
  getScoreByCategory,
  addScoreByCategory,
  checkExamAlreadyGive,
  checkLive,
  getPassword,
  addCategory,
} = require('../controllers/scoreController');

const router = express.Router();

router.post('/add-category/', addCategory);
router.post('/:category', addScoreByCategory);
router.get('/:category', getScoreByCategory);
router.get('/check-done/:id', checkExamAlreadyGive);
router.get('/check-live/:category', checkLive);
router.get('/get-password/:category', getPassword);

module.exports = router;
