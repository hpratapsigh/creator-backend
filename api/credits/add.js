const express = require('express');
const { addCredits } = require('../../lib/credits');
const { authenticate } = require('../../lib/auth');
const User = require('../../models/User');
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const { credits } = req.body;

  try {
    const user = await addCredits(req.user.id, credits);

    if (!user) return res.status(400).json({ msg: 'User not found' });

    res.json({ credits: user.credits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  } 
});


module.exports = router;
