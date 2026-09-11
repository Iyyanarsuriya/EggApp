const DailyPrice = require('../models/DailyPrice');

// @desc    Get current daily egg rates
// @route   GET /api/daily-prices
// @access  Public
const getDailyPrices = async (req, res, next) => {
  try {
    const dailyPrices = await DailyPrice.getLatest();
    res.json({
      success: true,
      dailyPrices
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update daily egg rates
// @route   PUT /api/daily-prices
// @access  Private/Admin
const updateDailyPrices = async (req, res, next) => {
  try {
    const { date, note, market_trend, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one egg variety with price is required.'
      });
    }

    // Format and sanitize items
    const sanitizedItems = items.map((item) => ({
      id: item.id || `egg_${Date.now()}`,
      name: item.name || 'Egg Variety',
      tamil_name: item.tamil_name || '',
      category: item.category || 'White Egg',
      price_per_piece: parseFloat(item.price_per_piece) || 0,
      price_per_tray: parseFloat(item.price_per_tray) || (parseFloat(item.price_per_piece || 0) * 30),
      tray_size: item.tray_size || '30 pcs',
      change: item.change || '0.00',
      trend: item.trend || 'steady',
      icon: item.icon || '🥚'
    }));

    const updated = await DailyPrice.update(
      {
        date,
        note,
        market_trend,
        items: sanitizedItems
      },
      req.user
    );

    res.json({
      success: true,
      message: "Today's live egg prices updated successfully!",
      dailyPrices: updated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDailyPrices,
  updateDailyPrices
};
