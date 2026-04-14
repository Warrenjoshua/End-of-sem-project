const express = require('express');
const StudySession = require('../models/StudySession');
const StudyGroup = require('../models/StudyGroup');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all study sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await StudySession.findAll({
      include: [
        { model: StudyGroup, attributes: ['id', 'name', 'courseName'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sessions for a specific group
router.get('/group/:groupId', async (req, res) => {
  try {
    const sessions = await StudySession.findAll({
      where: { groupId: req.params.groupId },
      include: [
        { model: StudyGroup, attributes: ['id', 'name', 'courseName'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single study session
router.get('/:id', async (req, res) => {
  try {
    const session = await StudySession.findByPk(req.params.id, {
      include: [
        { model: StudyGroup, attributes: ['id', 'name', 'courseName', 'meetingLocation', 'meetingType'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });
    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create study session
router.post('/', auth, async (req, res) => {
  try {
    const { groupId, title, description, date, time, location, meetingLink } = req.body;

    // Check if user is member of the group
    const group = await StudyGroup.findByPk(groupId, {
      include: [{ model: User, as: 'members', where: { id: req.user.id }, required: false }]
    });

    if (!group || !group.members || group.members.length === 0) {
      return res.status(403).json({ message: 'Access denied. Not a member of this group.' });
    }

    const session = await StudySession.create({
      groupId,
      title,
      description,
      date,
      time,
      location,
      meetingLink,
      createdBy: req.user.id
    });

    const sessionWithAssociations = await StudySession.findByPk(session.id, {
      include: [
        { model: StudyGroup, attributes: ['id', 'name', 'courseName'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json(sessionWithAssociations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update study session
router.put('/:id', auth, async (req, res) => {
  try {
    const session = await StudySession.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }

    // Check if user created the session
    if (session.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Creator only.' });
    }

    const { title, description, date, time, location, meetingLink } = req.body;

    await session.update({
      title,
      description,
      date,
      time,
      location,
      meetingLink
    });

    const updatedSession = await StudySession.findByPk(session.id, {
      include: [
        { model: StudyGroup, attributes: ['id', 'name', 'courseName'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json(updatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete study session
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await StudySession.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }

    // Check if user created the session
    if (session.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Creator only.' });
    }

    await session.destroy();
    res.json({ message: 'Study session deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;