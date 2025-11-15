// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // 引入MySQL连接

// 定义User模型（对应MySQL中的users表）
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // 自增ID（主键）
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, // 邮箱唯一
    validate: {
      isEmail: true // 验证邮箱格式
    }
  },
  githubUsername: {
    type: DataTypes.STRING(50),
    allowNull: false // GitHub用户名（如octocat）
  },
  githubId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true // GitHub唯一ID（避免重复关联）
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: true // GitHub邮箱已验证
  },
    avatarUrl: {
    type: DataTypes.STRING,  // 存储GitHub头像的URL字符串
    allowNull: true  // 允许为空（兼容旧用户）
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW // 创建时间（自动填充）
  }
}, {
  tableName: 'users', // 数据库表名（默认复数形式，这里显式指定）
  timestamps: false // 关闭sequelize自动添加的updatedAt字段
});

// 同步模型到数据库（不存在则创建表，存在则不修改）
const syncUserTable = async () => {
    await User.sync({ alter: true }); 
//   await User.sync({ force: false }); // force: false 表示不删除已有表
  console.log('✅ User表同步完成（不存在则已创建）');
};

module.exports = { User, syncUserTable };
