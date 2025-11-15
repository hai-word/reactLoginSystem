// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// 创建MySQL连接实例
const sequelize = new Sequelize(
  process.env.MYSQL_DB,        // 数据库名
  process.env.MYSQL_USER,      // 用户名
  process.env.MYSQL_PASSWORD,  // 密码
  {
    host: process.env.MYSQL_HOST,  // 地址
    port: process.env.MYSQL_PORT,  // 端口
    dialect: 'mysql',              // 数据库类型
    logging: false,                // 关闭SQL日志（可选，开发时可设为true）
    dialectOptions: {
      timezone: 'Asia/Shanghai'    // 时区配置
    }
  }
);

// 测试数据库连接
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL数据库连接成功！');
  } catch (error) {
    console.error('❌ MySQL连接失败：', error.message);
    process.exit(1); // 连接失败退出进程
  }
};

module.exports = { sequelize, testDbConnection };
