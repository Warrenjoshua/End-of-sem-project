const express = require('express');
const router = express.Router();
const StudySession = require('../models/StudySession');
const StudyGroup = require('../models/StudyGroup');
const auth = require('../middleware/auth');

// Create session (leader only)
router.post('/', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findByPk(req.body.groupId);
    if (!group || group.leaderId !== req.user.id) {
      return res.status(403).json({ message: 'Only group leader can create sessions' });
    }
    
    const session = await StudySession.create({
      ...req.body,
      createdBy: req.user.id
    });
    
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sessions for user's groups
router.get('/my-sessions', auth, async (req, res) => {
  try {
    const groups = await StudyGroup.findAll({
      include: [{
        model: StudySession,
        required: false
      }]
    });
    
    // Filter groups user is member of
    const userGroups = [];
    for (const group of groups) {
      const members = await group.getMembers();
      if (members.some(m => m.id === req.user.id)) {
        userGroups.push(group);
      }
    }
    
    const sessions = [];
    for (const group of userGroups) {
      const groupSessions = await StudySession.findAll({
        where: { groupId: group.id },
        include: ['group']
      });
      sessions.push(...groupSessions);
    }
    
    sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;