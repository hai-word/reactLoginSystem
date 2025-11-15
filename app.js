// 后端 app.js（找到以下位置添加代码）
const express = require('express');
const cors = require('cors');
const githubAuthRoutes = require('./routes/githubAuth'); // 已有：GitHub登录回调路由
const userInfoRoutes = require('./routes/userInfo'); // 新增：导入用户信息接口
const { sequelize, testDbConnection } = require('./config/db');
const { syncUserTable } = require('./models/User');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件（已有）
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 注册路由（新增 userInfo 路由）
app.use('/api/github', githubAuthRoutes); // 已有：/api/github/callback
app.use('/api/userInfo', userInfoRoutes); // 新增：/api/userInfo（前端请求的接口路径）

// 测试路由（已有）
app.get('/api/test', (req, res) => {
  res.json({ message: '后端服务器正常运行！' });
});

// 启动流程（已有）
const startServer = async () => {
  try {
    await testDbConnection();
    await syncUserTable();
    app.listen(PORT, () => {
      console.log(`🚀 后端服务器已启动，运行在：http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动失败：', error.message);
  }
};

startServer();
