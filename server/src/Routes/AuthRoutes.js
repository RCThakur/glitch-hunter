const express = require('express');
const router = express.Router();
const User = require('../Model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../utils/token');



// / POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ success: false, message: 'Username already taken' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user and save 
    const newUser = new User({ 
      username, 
      passwordHash: hashedPassword,  // <-- must match your schema
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token, user: { id: newUser._id, username: newUser.username } });
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
