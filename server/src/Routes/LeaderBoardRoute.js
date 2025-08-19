const express = require('express');

const LeaderRouter = express.Router();
const Preferences = require('../Model/Prefernces');
const authMiddleware = require('../utils/token');

const User = require("../Model/User");




LeaderRouter.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find({ leastBulletUsedEver: { $ne: null } })
      .sort({ leastBulletUsedEver: 1,time:1 ,updatedAt: 1 }) // sort by least bullets, then latest update
      .limit(10) // top 10 players
      .populate('leastBulletUsedLevel', 'name difficulty') // show level info
      .select('username leastBulletUsedEver leastBulletUsedLevel time');

    res.json({
      success: true,
      leaderboard
    });

  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
module.exports= LeaderRouter;