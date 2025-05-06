const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Twitter API integration (mocked here)
    const response = await axios.get('https://api.twitter.com/2/tweets'); 
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching Twitter feed' });
  }
});

module.exports = router;
