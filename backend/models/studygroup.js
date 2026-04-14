const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const StudyGroup = sequelize.define('StudyGroup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  courseName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'course_name'
  },
  courseCode: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'course_code'
  },
  faculty: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  meetingLocation: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'meeting_location'
  },
  meetingType: {
    type: DataTypes.ENUM('physical', 'online'),
    defaultValue: 'physical',
    field: 'meeting_type'
  },
  leaderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'leader_id',
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'study_groups',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Define associations
StudyGroup.belongsTo(User, { as: 'leader', foreignKey: 'leaderId' });
StudyGroup.belongsToMany(User, { 
  through: 'group_members', 
  as: 'members',
  foreignKey: 'group_id',
  otherKey: 'user_id',
  timestamps: false
});
User.belongsToMany(StudyGroup, { 
  through: 'group_members', 
  as: 'joinedGroups',
  foreignKey: 'user_id',
  otherKey: 'group_id'
});

module.exports = StudyGroup;