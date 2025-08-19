const express = require('express');
const router = express.Router();
const User = require('../Model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../utils/token');
const Level = require("../Model/Level");
const Difficulty = require("../Model/Difficulty");
const Preferences = require("../Model/Prefernces");



// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    console.log(`New user ${username}'s registration in process....`);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log("Password hashed!");

    // ✅ Get default difficulty (easy) and first level
    const defaultDifficulty = await Difficulty.findOne({ name: 'easy' });
    if (!defaultDifficulty) {
      return res.status(500).json({ success: false, message: 'Default difficulty not found' });
    }

    console.log("Default difficulty set!");

    const defaultLevel = await Level.findOne({ name: 1, difficulty: 1 });
    if (!defaultLevel) {
      return res.status(500).json({ success: false, message: 'Default level not found' });
    }

    console.log("Default level set!");

    // ✅ Check if default preferences already exist for this username
    let preferences = await Preferences.findOne({ userId: null, volume: 50, sfx: true });

    if (!preferences) {
      preferences = new Preferences({
        volume: 50,
        sfx: true
      });
      await preferences.save();
    }

    console.log("Default preferences created!");

    // ✅ Create new user with required fields
    const newUser = new User({
      username,
      passwordHash: hashedPassword,
      currentDifficulty: defaultDifficulty._id,
      currentLevel: defaultLevel._id,
      gameIsPaused: false,
      isLoggedIn: true,   
      userLastSession: { 
        difficulty: defaultDifficulty._id,
        level: defaultLevel._id
      },
      time: defaultLevel.defaultTime,
      leastBulletUsedEver: null,
      leastBulletUsedLevel: defaultLevel._id,
      preference: preferences._id
    });

    await newUser.save();

    // ✅ Update preference.userId only if it's not linked yet
    if (!preferences.userId) {
      preferences.userId = newUser._id;
      await preferences.save();
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        currentDifficulty: newUser.currentDifficulty,
        currentLevel: newUser.currentLevel,
        preference: preferences
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Prevent guest users from logging in
    if (user.isGuest) {
      return res.status(400).json({ success: false, message: 'Guest cannot login' });
    }

    // Check if password exists
    if (!user.passwordHash) {
      return res.status(400).json({ success: false, message: 'No password set for this user' });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // console.log(token);

    res.json({ success: true, token, user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// POST /api/auth/guest
router.post('/guest', async (req, res) => {
  try {

    const guestCount = await User.countDocuments({ isGuest: true });
    const guestUsername = `guest-${guestCount + 1}`;

    const guest = new User({ username: guestUsername, isGuest: true });
    await guest.save();

    res.json({ success: true, guestId: guest._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



module.exports = router;
