const express = require('express');
const router = express.Router();
const User = require('../models/User');
const StudyGroup = require('../models/StudyGroup');
const auth = require('../middleware/auth');

// Admin middleware
router.use(auth);
router.use(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGroups = await StudyGroup.countDocuments();
    
    // Most active courses
    const courseStats = await StudyGroup.aggregate([
      { $group: { _id: '$courseName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      totalUsers,
      totalGroups,
      activeCourses: courseStats
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;