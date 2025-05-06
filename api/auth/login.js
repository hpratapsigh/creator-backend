const express = require('express');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../lib/auth');
const User = require('../../models/User');
const router = express.Router();

console.log('login router loaded');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Check if user already received credits today
    const now = new Date();
    const lastLogin = user.lastLogin || new Date(0);
    const isSameDay =
      now.getFullYear() === lastLogin.getFullYear() &&
      now.getMonth() === lastLogin.getMonth() &&
      now.getDate() === lastLogin.getDate();

    if (!isSameDay) {
      user.credits += 10; // 🎁 Add 10 credits for daily login
    }

    user.lastLogin = now;
    await user.save();

    const token = generateToken(user);
    res.json({ token,user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
