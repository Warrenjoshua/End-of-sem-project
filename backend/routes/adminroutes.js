const express = require('express');
const User = require('../models/User');
const StudyGroup = require('../models/StudyGroup');
const StudySession = require('../models/StudySession');
const auth = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth);
router.use(auth.isAdmin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, program, yearOfStudy, role } = req.body;

    await user.update({
      name,
      email,
      program,
      yearOfStudy,
      role
    });

    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' });
    }

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all study groups
router.get('/groups', async (req, res) => {
  try {
    const groups = await StudyGroup.findAll({
      include: [
        { model: User, as: 'leader', attributes: ['id', 'name', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete study group (admin)
router.delete('/groups/:id', async (req, res) => {
  try {
    const group = await StudyGroup.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    await group.destroy();
    res.json({ message: 'Study group deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all study sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await StudySession.findAll({
      include: [
        { model: StudyGroup, attributes: ['id', 'name', 'courseName'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete study session (admin)
router.delete('/sessions/:id', async (req, res) => {
  try {
    const session = await StudySession.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }

    await session.destroy();
    res.json({ message: 'Study session deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [userCount] = await User.sequelize.query('SELECT COUNT(*) as count FROM users');
    const [groupCount] = await StudyGroup.sequelize.query('SELECT COUNT(*) as count FROM study_groups');
    const [sessionCount] = await StudySession.sequelize.query('SELECT COUNT(*) as count FROM study_sessions');

    res.json({
      users: userCount[0].count,
      groups: groupCount[0].count,
      sessions: sessionCount[0].count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;