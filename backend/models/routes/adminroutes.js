const express = require('express');
const router = express.Router();
const User = require('../models/User');
const StudyGroup = require('../models/StudyGroup');
const { sequelize } = require('../config/database');
const auth = require('../middleware/auth');

// Admin middleware
router.use(auth);
router.use(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalGroups = await StudyGroup.count();
    
    // Most active courses
    const [courseStats] = await sequelize.query(
      `SELECT course_name, COUNT(*) as count 
       FROM study_groups 
       GROUP BY course_name 
       ORDER BY count DESC 
       LIMIT 5`
    );
    
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
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;