// 后端 routes/userInfo.js（直接复制粘贴）
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models/User'); // 关联MySQL用户模型
require('dotenv').config();

// 用户信息接口（前端请求的 /api/userInfo 对应这个接口）
router.get('/', async (req, res) => {
  try {
    // 1. 从请求头获取 Token（前端会携带 Bearer + Token）
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未提供有效 Token，请重新登录' });
    }

    // 2. 提取并验证 Token
    const token = authHeader.split(' ')[1]; // 去掉 Bearer 前缀，拿到纯 Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 用之前的 JWT_SECRET 验证

    // 3. 根据 Token 中的 userId 查询用户信息
    const user = await User.findByPk(decoded.userId, {
       attributes: ['email', 'githubUsername', 'githubId', 'createdAt', 'avatarUrl'] // 新增 avatarUrl
    });

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 4. 成功返回用户信息
    res.json(user);

  } catch (err) {
    // 错误处理（Token 无效/过期、服务器错误等）
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token 无效，请重新登录' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token 已过期，请重新登录' });
    }
    console.error('用户信息接口错误：', err.message);
    res.status(500).json({ message: '服务器错误，无法获取用户信息' });
  }
});

module.exports = router;
