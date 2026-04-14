const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const StudyGroup = require('./StudyGroup');
const User = require('./User');

const StudySession = sequelize.define('StudySession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'group_id',
    references: {
      model: StudyGroup,
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'session_date'
  },
  time: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'session_time'
  },
  location: {
    type: DataTypes.STRING(255)
  },
  meetingLink: {
    type: DataTypes.STRING(500),
    field: 'meeting_link'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'created_by',
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'study_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

StudySession.belongsTo(StudyGroup, { foreignKey: 'groupId' });
StudySession.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
StudyGroup.hasMany(StudySession, { foreignKey: 'groupId' });

module.exports = StudySession;