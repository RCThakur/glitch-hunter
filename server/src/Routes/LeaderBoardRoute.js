const express = require('express');

const LeaderRouter = express.Router();
const Preferences = require('../Model/Prefernces');
const authMiddleware = require('../utils/token');

const User = require("../Model/User");

/**
 * @swagger
 * tags:
 *   name: Leaderboard
 *   description: Game leaderboard management
 */

/**
 * @swagger
 * /api/lead/leaderboard:
 *   get:
 *     summary: Get top 10 players leaderboard
 *     tags: [Leaderboard]
 *     responses:
 *       200:
 *         description: Successfully retrieved leaderboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 leaderboard:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       leastBulletUsedEver:
 *                         type: number
 *                       time:
 *                         type: number
 *                       leastBulletUsedLevel:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: number
 *                           difficulty:
 *                             type: number
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/lead/leaderboard:
 *   get:
 *     summary: Get the game leaderboard
 *     tags: [Leaderboard]
 *     description: Retrieves top 10 players sorted by least bullets used and completion time
 *     responses:
 *       200:
 *         description: Successfully retrieved leaderboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 leaderboard:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         description: Player's username
 *                       leastBulletUsedEver:
 *                         type: number
 *                         description: Least number of bullets used to complete a level
 *                       time:
 *                         type: number
 *                         description: Time taken to complete the level
 *                       leastBulletUsedLevel:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: number
 *                             description: Level number
 *                           difficulty:
 *                             type: number
 *                             description: Difficulty ID
 *       500:
 *         description: Server error
 */
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