const User = require('../models/User');

const addCredits = async (userId, credits) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    user.credits += credits;
    await user.save();
    return user;
  } catch (error) {
    console.error("Error adding credits:", error);
    return null;
  }
};

const getCredits = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user ? user.credits : 0;
  } catch (error) {
    console.error("Error fetching credits:", error);
    return 0;
  }
};

module.exports = { addCredits, getCredits };
