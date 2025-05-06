const express = require('express');
const { authenticate } = require('../../lib/auth');  // Assuming authenticate middleware is in this file
const User = require('../../models/User');
const { addCredits } = require('../../lib/credits');
const router = express.Router();

// Route to get current user details
router.get('/', authenticate, async (req, res) => {
  try {
    // Find the user by ID (from the token payload)
    const user = await User.findById(req.user.id).select('-password');  // Exclude password field

    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Send user data excluding sensitive information like password
    res.json({
      name: user.name,
      email: user.email,
      credits: user.credits,
      savedFeeds: user.savedFeeds,
      activityLog: user.recentActivity  // assuming this is the field for recent activities
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Route to get list of all users (admin only)
router.get('/all', authenticate, async (req, res) => {
    try {
      // You may want to check if the authenticated user is an admin
      const requestingUser = await User.findById(req.user.id);
      if (!requestingUser || requestingUser.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
      }
  
      const users = await User.find().select('-password'); // Exclude passwords
  
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  });  

  // Route to update profile
// Route to update profile and handle credits
router.put('/me', authenticate, async (req, res) => {
    try {
      const { name, email, credit, role } = req.body;
  
      // Ensure user is allowed to change the role only if they are an admin
      const requestingUser = await User.findById(req.user.id);
      if (!requestingUser) {
        return res.status(404).json({ msg: 'Requesting user not found' });
      }
  
      // If the requesting user is an admin, allow updating role
      if (requestingUser.role !== 'admin' && role) {
        return res.status(403).json({ msg: 'You are not authorized to change the role.' });
      }
  
      // If the requesting user is not an admin, don't allow updating their own role
      if (role && requestingUser.role !== 'admin') {
        return res.status(403).json({ msg: 'You are not authorized to update your own role.' });
      }
  
      // Only allow credit modification if it's the requesting user's own credit
      if (credit && requestingUser.role === 'admin') {
        // Admin can update credit for any user
        const userToUpdate = await User.findById(req.user.id); // If updating own credit
        userToUpdate.credits = credit;
        await userToUpdate.save();
        return res.json(userToUpdate);
      }
  
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      if (name) user.name = name;
      if (email) user.email = email;
  
      // If credits were provided, update them
      if (credit) {
        user.credits = credit; // Optionally modify this logic based on business rules
      }
  
      // If the role is provided, only update if the user is an admin
      if (role && requestingUser.role === 'admin') {
        user.role = role; // Update role if the user is an admin
      }
  
      // Save the updated user
      await user.save();
  
      res.json({
        name: user.name,
        email: user.email,
        credits: user.credits,
        savedFeeds: user.savedFeeds,
        activityLog: user.recentActivity,
      });
    } catch (err) {
      console.error('Error updating user:', err);  // Log error details
      res.status(500).json({ msg: 'Server error' });
    }
  });  

module.exports = router;
