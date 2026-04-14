const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const StudyGroup = require('./StudyGroup');
const User = require('./User');

const Discussion = sequelize.define('Discussion', {
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
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'author_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('announcement', 'question', 'general'),
    defaultValue: 'general'
  }
}, {
  tableName: 'discussions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  discussionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'discussion_id',
    references: {
      model: Discussion,
      key: 'id'
    }
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'author_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Discussion.belongsTo(StudyGroup, { foreignKey: 'groupId' });
Discussion.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
Discussion.hasMany(Comment, { foreignKey: 'discussionId' });
Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

module.exports = { Discussion, Comment };