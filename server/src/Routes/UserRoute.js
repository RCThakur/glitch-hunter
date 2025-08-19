const express = require('express');
const router = express.Router();
const Preferences = require('../Model/Prefernces');
const authMiddleware = require('../utils/token');
const Level = require("../Model/Level");
const Difficulty = require("../Model/Difficulty");
const User = require("../Model/User");
const mongoose = require('mongoose');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User preferences and profile management
 */

/**
 * @swagger
 * /api/user/preferences:
 *   post:
 *     summary: Create user preferences
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - volume
 *               - sfx
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *               volume:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Volume level (0-100)
 *               sfx:
 *                 type: boolean
 *                 description: Sound effects enabled/disabled
 *     responses:
 *       201:
 *         description: Preferences created successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.post('/preferences', authMiddleware,  async (req, res) => {
  try {
    const { userId, volume, sfx } = req.body;

    // Check if user exists
    const user = await User.findById({ _id : userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create new preferences
    const newPref = new Preferences({
      userId,
      volume,
      sfx
    });

    await newPref.save();

    // Link preferences to user
    user.preference = newPref._id;
    await user.save();

    res.status(201).json({ message: 'Preferences created successfully', preferences: newPref });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/user/preferences/{userId}:
 *   put:
 *     summary: Update user preferences
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               volume:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               sfx:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *       404:
 *         description: Preferences not found
 *       401:
 *         description: Unauthorized
 */
router.put('/preferences/:userId', authMiddleware,  async (req, res) => {
  try {
    const { userId } = req.params;
    const { volume, sfx } = req.body;

    // Find existing preferences by userId
    const preferences = await Preferences.findOne({ userId });
    if (!preferences) return res.status(404).json({ message: 'Preferences not found' });

    // Update fields if provided
    if (volume !== undefined) preferences.volume = volume;
    if (sfx !== undefined) preferences.sfx = sfx;

    await preferences.save();

    res.json({ message: 'Preferences updated successfully', preferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/user/progress/{id}:
 *   get:
 *     summary: Get user progress and information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     currentLevel:
 *                       $ref: '#/components/schemas/Level'
 *                     currentDifficulty:
 *                       type: number
 *                     preference:
 *                       $ref: '#/components/schemas/Preferences'
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.get('/progress/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    // ✅ Find user and populate references
    const user = await User.findById(id)
      .populate('currentLevel')
      .populate('leastBulletUsedLevel')
      .populate('preference')
      .populate('userLastSession.level')
      .populate('experience.user.level');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    delete user.passwordHash;

    res.json({ success: true, user });

  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Determine next difficulty based on performance
const getNextDifficulty = (currentLevel, bulletsUsed, timeTaken, botsKilled) => {
  const { bullets, defaultTime } = currentLevel;
  
  // Example thresholds: adjust as needed per level
  if (bulletsUsed <= bullets / 2 && timeTaken <= defaultTime / 2 && botsKilled === currentLevel.bots) {
    return 'hard';
  }
  if (bulletsUsed <= bullets * 0.8 && timeTaken <= defaultTime) {
    return 'medium';
  }
  return 'easy';
};

// Determine next level time based on next difficulty and current performance
const getNextLevelTime = (nextDifficultyName, nextLevel, bulletsUsed, timeTaken) => {
  const baseTime = nextLevel.defaultTime;

  // Easy always gets defaultTime
  if (nextDifficultyName === 'easy') return baseTime;

  // For medium/hard, reduce time proportionally to performance
  let timeReductionFactor = 1;

  if (nextDifficultyName === 'medium') {
    timeReductionFactor = 0.85; // reduce time by 15% for medium
  } else if (nextDifficultyName === 'hard') {
    timeReductionFactor = 0.7; // reduce time by 30% for hard
  }

  // Reduce further if user used fewer bullets or finished faster
  const bulletFactor = bulletsUsed / nextLevel.bullets;
  const timeFactor = timeTaken / baseTime;

  const adjustedTime = baseTime * timeReductionFactor * Math.min(bulletFactor, timeFactor);

  return Math.max(1, Math.round(adjustedTime)); // minimum 1 second
};

// Helper: Adjust difficulty based on last cleared difficulty + current
const getDifficultyWithExperience = (lastDifficultyName, currentDifficultyName) => {
  const rules = {
    hard: { hard: 'hard', medium: 'medium', easy: 'medium' },
    medium: { hard: 'medium', medium: 'medium', easy: 'easy' },
    easy: { hard: 'medium', medium: 'medium', easy: 'easy' },
  };

  return rules[lastDifficultyName]?.[currentDifficultyName] || currentDifficultyName;
};

/**
 * @swagger
 * /api/user/progress:
 *   post:
 *     summary: Update user game progress
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - levelId
 *               - bulletsUsed
 *               - timeTaken
 *               - botsKilled
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *               levelId:
 *                 type: string
 *                 description: Level ID
 *               bulletsUsed:
 *                 type: number
 *                 description: Number of bullets used in the level
 *               timeTaken:
 *                 type: number
 *                 description: Time taken to complete the level
 *               botsKilled:
 *                 type: number
 *                 description: Number of bots killed in the level
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: User or level not found
 */
router.post('/progress', async (req, res) => {
  try {
    const { userId, levelId, bulletsUsed, timeTaken, botsKilled } = req.body;

    if (!userId || !levelId || bulletsUsed == null || timeTaken == null || botsKilled == null) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Fetch user
    const user = await User.findById({ _id  : userId }).populate('currentLevel currentDifficulty');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Fetch current level
    const currentLevel = await Level.findById({ _id : levelId }).populate('difficulty');
    if (!currentLevel) return res.status(404).json({ success: false, message: 'Level not found' });

    // Determine next difficulty
    let nextDifficultyName;
    if (botsKilled < currentLevel.bots || user.time < timeTaken) {
    // User lost the level → reduce difficulty
    if (currentLevel.difficulty.name === 'hard') nextDifficultyName = 'medium';
    else if (currentLevel.difficulty.name === 'medium') nextDifficultyName = 'easy';
    else nextDifficultyName = 'easy';
    } else {
        // User won → determine next difficulty based on performance
        nextDifficultyName = getNextDifficulty(currentLevel, bulletsUsed, timeTaken, botsKilled);
        
        // Adjust based on last level experience
        const lastDifficultyName = user.experience.length
            ? user.experience[user.experience.length - 1].user.difficulty.name
            : 'easy';

        nextDifficultyName = getDifficultyWithExperience(lastDifficultyName, nextDifficultyName);
    }

    const nextDifficulty = await Difficulty.findOne({ name: nextDifficultyName });
    if (!nextDifficulty) return res.status(500).json({ success: false, message: 'Difficulty not found' });

    // Determine next level
    let nextLevel;
    if (botsKilled < currentLevel.bots || user.time < timeTaken) {
      nextLevel = await Level.findOne({ name: currentLevel.name, difficulty: nextDifficulty._id }); // repeat same level if lost with less difficulty
    } else {
      nextLevel = await Level.findOne({ name: currentLevel.name + 1, difficulty: nextDifficulty._id }) || currentLevel;
    }

    // Update user fields
    user.currentDifficulty = nextDifficulty._id;
    user.currentLevel = nextLevel._id;
    user.userLastSession = { difficulty: nextDifficulty._id, level: nextLevel._id };

    // Update experience
    if (botsKilled < currentLevel.bots || user.time < timeTaken) {
        console.log("Not updating the experience as user is not advanced to next level!");
    } else user.experience.push({ user: { difficulty: currentLevel.difficulty._id, level: currentLevel._id } });

    // Track least bullets used ever
    if (!user.leastBulletUsedEver || bulletsUsed < user.leastBulletUsedEver) {
      user.leastBulletUsedEver = bulletsUsed;
      user.leastBulletUsedLevel = currentLevel._id;
    }

    // Update user time for next level
    user.time = getNextLevelTime(nextDifficultyName, nextLevel, bulletsUsed, timeTaken);

    await user.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;