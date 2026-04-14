const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const StudyGroup = require('../models/StudyGroup');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create a group
router.post('/', auth, async (req, res) => {
  try {
    const group = await StudyGroup.create({
      ...req.body,
      leaderId: req.user.id
    });
    
    // Add creator as member
    await group.addMember(req.user.id);
    
    // Fetch group with leader info
    const groupWithLeader = await StudyGroup.findByPk(group.id, {
      include: [{ model: User, as: 'leader', attributes: ['id', 'name', 'email'] }]
    });
    
    res.status(201).json(groupWithLeader);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all groups with filters
router.get('/', auth, async (req, res) => {
  try {
    const { courseName, faculty, search } = req.query;
    let whereClause = {};
    
    if (courseName) {
      whereClause.courseName = { [Sequelize.Op.like]: `%${courseName}%` };
    }
    if (faculty) {
      whereClause.faculty = { [Sequelize.Op.like]: `%${faculty}%` };
    }
    if (search) {
      whereClause[Sequelize.Op.or] = [
        { name: { [Sequelize.Op.like]: `%${search}%` } },
        { courseName: { [Sequelize.Op.like]: `%${search}%` } },
        { courseCode: { [Sequelize.Op.like]: `%${search}%` } }
      ];
    }
    
    const groups = await StudyGroup.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'leader', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } }
      ]
    });
    
    // Format response to match frontend expectations
    const formattedGroups = groups.map(group => ({
      _id: group.id,
      name: group.name,
      courseName: group.courseName,
      courseCode: group.courseCode,
      faculty: group.faculty,
      description: group.description,
      meetingLocation: group.meetingLocation,
      meetingType: group.meetingType,
      leader: group.leader,
      members: group.members,
      membersCount: group.members.length
    }));
    
    res.json(formattedGroups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single group
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findByPk(req.params.id, {
      include: [
        { model: User, as: 'leader', attributes: ['id', 'name', 'email', 'program'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email', 'program', 'yearOfStudy'] }
      ]
    });
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    res.json({
      _id: group.id,
      name: group.name,
      courseName: group.courseName,
      courseCode: group.courseCode,
      faculty: group.faculty,
      description: group.description,
      meetingLocation: group.meetingLocation,
      meetingType: group.meetingType,
      leader: group.leader,
      members: group.members
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update group (leader only)
router.put('/:id', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    if (group.leaderId !== req.user.id) {
      return res.status(403).json({ message: 'Only group leader can edit' });
    }
    
    await group.update(req.body);
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Join group
router.post('/:id/join', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const members = await group.getMembers();
    const isMember = members.some(m => m.id === req.user.id);
    
    if (isMember) {
      return res.status(400).json({ message: 'Already a member' });
    }
    
    await group.addMember(req.user.id);
    res.json({ message: 'Successfully joined the group' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave group
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    await group.removeMember(req.user.id);
    res.json({ message: 'Successfully left the group' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;