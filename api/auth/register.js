const express = require('express');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../lib/auth');
const User = require('../../models/User');
const router = express.Router();

console.log('register router loaded'); // Add this for debugging

router.post('/', async (req, res) => {
  const { email, password, name, role = 'user' } = req.body; // Default role is 'user'
  console.log(email);
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Create new user
    user = new User({
      email,
      password,
      name,
      role,        // Add role here
      credits: 10  // Add 10 credits to the user on registration
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Generate token
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
