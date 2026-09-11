const express = require('express');
const router = express.Router();
const {
  getDailyPrices,
  updateDailyPrices
} = require('../controllers/dailyPriceController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/')
  .get(getDailyPrices)
  .put(protect, admin, updateDailyPrices);

module.exports = router;
