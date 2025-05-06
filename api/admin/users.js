// /api/admin/users.js
const express = require('express');
const { authenticate } = require('../../lib/auth');
const User = require('../../models/User');
const router = express.Router();

// Route to get all users, only accessible to admins
router.get('/', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied' });  // Unauthorized access
  }

  try {
    // Fetch all users
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/admin/users - Only accessible to admin
router.get('/users', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  try {
    const users = await User.find().select('-password -__v');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while fetching users' });
  }
});

// GET /api/admin/feeds - Only accessible to admin
router.get('/feeds', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  try {
    const feeds = await Feed.find().select('-__v'); // Adjust fields as needed
    res.json(feeds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while fetching feeds' });
  }
});

// PUT /api/admin/users/change - Change credit and role of a selected user
router.put('/change', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  const { email, credit, role } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update credit and role
    if (credit !== undefined) user.credits = credit;
    if (role) user.role = role;

    await user.save();

    res.json({
      msg: 'User updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ msg: 'Server error while updating user' });
  }
});



module.exports = router;
