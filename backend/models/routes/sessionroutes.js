const express = require('express');
const router = express.Router();
const StudySession = require('../models/StudySession');
const StudyGroup = require('../models/StudyGroup');
const auth = require('../middleware/auth');

// Create session (leader only)
router.post('/', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.body.group);
    if (group.leader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only group leader can create sessions' });
    }
    
    const session = new StudySession({
      ...req.body,
      createdBy: req.user.id
    });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sessions for user's groups
router.get('/my-sessions', auth, async (req, res) => {
  try {
    const userGroups = await StudyGroup.find({ members: req.user.id });
    const groupIds = userGroups.map(g => g._id);
    
    const sessions = await StudySession.find({ group: { $in: groupIds } })
      .populate('group', 'name')
      .sort({ date: 1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;