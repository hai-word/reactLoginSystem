// routes/githubAuth.js（带详细日志版本）
const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
require('dotenv').config();

router.get('/callback', async (req, res) => {
  try {
    console.log('===== 开始处理GitHub登录回调 =====');
    const { code } = req.query;
    
    // 日志1：打印接收的授权码
    console.log('1. 接收的GitHub授权码：', code ? '已获取' : '未获取');
    if (!code) {
      console.error('错误：缺少授权码');
      return res.status(400).send('缺少授权码，登录失败');
    }

    // 1. 换取GitHub Access Token
    console.log('2. 开始换取GitHub Access Token...');
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token, error } = tokenResponse.data;
    // 日志2：打印Token换取结果
    console.log('3. Token换取结果：', access_token ? '成功' : '失败');
    if (error || !access_token) {
      console.error('错误：获取GitHub Token失败，原因：', error);
      return res.status(400).send(`获取GitHub Token失败：${error}`);
    }
    console.log('   Access Token（前20位）：', access_token.slice(0, 20) + '...');

    // 2. 获取GitHub用户信息和头像
    console.log('4. 开始获取GitHub用户信息...');
    const userInfoRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${access_token}` }
    });
    const { 
      login: githubUsername, 
      id: githubId,
      avatar_url: avatarUrl 
    } = userInfoRes.data;

    // 日志3：打印用户信息和头像URL
    console.log('5. 用户信息获取成功：');
    console.log('   - GitHub用户名：', githubUsername);
    console.log('   - GitHub ID：', githubId);
    console.log('   - 头像URL：', avatarUrl || '未获取到'); // 重点日志：查看头像是否存在

    // 获取主邮箱
    console.log('6. 开始获取GitHub绑定邮箱...');
    const emailsRes = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `token ${access_token}` }
    });
    const primaryEmail = emailsRes.data.find(email => email.primary && email.verified)?.email;
    
    // 日志4：打印邮箱获取结果
    console.log('7. 邮箱获取结果：', primaryEmail ? primaryEmail : '未找到有效邮箱');
    if (!primaryEmail) {
      console.error('错误：无法获取有效邮箱');
      return res.status(400).send('无法获取GitHub绑定的有效邮箱，登录失败');
    }

    // 3. 查找或创建用户
    console.log('8. 开始查询用户（GitHub ID：', githubId, '）...');
    let user = await User.findOne({ 
      where: { githubId } 
    });

    if (!user) {
      // 新用户创建
      console.log('9. 未找到用户，开始创建新用户...');
      user = await User.create({
        email: primaryEmail,
        githubUsername,
        githubId,
        avatarUrl: avatarUrl
      });
      console.log('10. 新用户创建成功！用户信息：', {
        id: user.id,
        email: user.email,
        githubUsername: user.githubUsername,
        avatarUrl: user.avatarUrl
      });
    } else {
      // 老用户更新头像
      console.log('9. 找到已存在用户，开始更新头像...');
      console.log('   - 更新前头像URL：', user.avatarUrl);
      console.log('   - 待更新头像URL：', avatarUrl);
      
      await user.update({ 
        avatarUrl: avatarUrl,
        email: primaryEmail
      });
      
      // 重新查询用户，验证更新结果
      const updatedUser = await User.findByPk(user.id);
      console.log('10. 老用户更新成功！更新后头像URL：', updatedUser.avatarUrl);
    }

    // 4. 生成JWT Token
    console.log('11. 开始生成前端访问Token...');
    const localToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('12. Token生成成功（前20位）：', localToken.slice(0, 20) + '...');

    // 5. 跳转回前端
    console.log('13. 准备跳转回前端：http://localhost:3000/login?token=xxx');
    res.redirect(`http://localhost:3000/login?token=${localToken}`);
    console.log('===== GitHub登录回调处理完成 =====\n');

  } catch (err) {
    // 错误日志：打印完整错误信息（含堆栈）
    console.error('\n===== GitHub登录回调失败 =====');
    console.error('错误信息：', err.message);
    console.error('错误堆栈：', err.stack);
    console.error('===============================\n');
    res.status(500).send('服务器错误，GitHub登录失败，请重试');
  }
});

module.exports = router;
