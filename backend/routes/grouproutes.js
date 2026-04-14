const express = require('express');
const StudyGroup = require('../models/StudyGroup');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all study groups
router.get('/', async (req, res) => {
  try {
    const groups = await StudyGroup.findAll({
      include: [
        { model: User, as: 'leader', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } }
      ]
    });
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single study group
router.get('/:id', async (req, res) => {
  try {
    const group = await StudyGroup.findByPk(req.params.id, {
      include: [
        { model: User, as: 'leader', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } }
      ]
    });
    if (!group) {
      return res.status(404).json({ message: 'Study group not found' });
    }
    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create study group
router.post('/', auth, async (req, res) => {
  try {
    const { name, courseName, courseCode, faculty, description, meetingLocation, meetingType } = req.body;

    const group = await StudyGroup.create({
      name,
      courseName,
      courseCode,
      faculty,
      description,
      meetingLocation,
      meetingType,
      leaderId: req.user.id
    });

    // Add creator as member
    await group.addMember(req.user.id);

    const groupWithAssociations = await StudyGroup.findByPk(group.id, {
      include: [
        { model: User, as: 'leader', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } }
      ]
    });

    res.status(201).json(groupWithAssociations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update study group
router.put('/:id', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    // Check if user is the leader
    if (group.leaderId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Leader only.' });
    }

    const { name, courseName, courseCode, faculty, description, meetingLocation, meetingType } = req.body;

    await group.update({
      name,
      courseName,
      courseCode,
      faculty,
      description,
      meetingLocation,
      meetingType
    });

    const updatedGroup = await StudyGroup.findByPk(group.id, {
      include: [
        { model: User, as: 'leader', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } }
      ]
    });

    res.json(updatedGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete study group
router.delete('/:id', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    // Check if user is the leader
    if (group.leaderId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Leader only.' });
    }

    await group.destroy();
    res.json({ message: 'Study group deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join study group
router.post('/:id/join', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    await group.addMember(req.user.id);
    res.json({ message: 'Joined study group successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave study group
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    // Leader cannot leave their own group
    if (group.leaderId === req.user.id) {
      return res.status(400).json({ message: 'Leader cannot leave their own group' });
    }

    await group.removeMember(req.user.id);
    res.json({ message: 'Left study group successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;