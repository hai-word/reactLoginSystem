import React, { useState, useEffect } from 'react'; // 新增 useEffect
import { GithubOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input, Card, Typography, Layout, Alert, Divider, Space, message } from 'antd';
import { Link, useSearchParams, Navigate } from 'react-router-dom'; // 新增路由相关API
import './Login.css';

const { Title, Text, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

const LoginPage: React.FC = () => {
    // 表单状态管理（不变）
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 新增：登录状态
    const [searchParams] = useSearchParams(); // 新增：获取URL参数（GitHub回调后携带Token）

    // 新增：处理GitHub登录回调后的Token（从URL提取并存储）
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('authToken', token); // 存储登录凭证
            setIsAuthenticated(true);
            message.success('GitHub登录成功！');
        }
    }, [searchParams]);

    // 新增：已登录则自动跳转到首页
    if (isAuthenticated || localStorage.getItem('authToken')) {
        return <Navigate to="/" replace />;
    }

    // 邮箱密码登录（不变）
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        setTimeout(() => {
            setIsLoading(false);
            setError('演示模式：请使用GitHub登录或查看代码实现');
        }, 1000);
    };

    // 核心修改：GitHub登录从模拟改为真实跳转
    const handleGithubLogin = () => {
        // 1. 替换为你在GitHub注册的OAuth应用信息
        const GITHUB_CLIENT_ID = 'Ov23li2Y2orY8irhwkEK'; // 必须替换！
        const REDIRECT_URI = 'http://localhost:3001/api/github/callback'; // 必须与GitHub应用配置一致！
        const SCOPE = 'user:email'; // 申请获取用户邮箱（用于关联本地账号）

        // 2. 构造GitHub授权页URL并跳转
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPE}`;
        window.location.href = githubAuthUrl; // 跳转到GitHub授权页
    };

    return (
        // 以下结构完全不变，沿用原有样式和布局
        <Layout className="login-layout">
            <Header className="login-header">
                <div className="logo">Bytebase</div>
            </Header>

            <Content className="login-content">
                <div className="login-container">
                    <Card className="login-card">
                        <div className="login-header-content">
                            <Title level={2} className="login-title">欢迎回来</Title>
                            <Paragraph className="login-subtitle">
                                登录到您的Bytebase账户，管理您的数据库变更
                            </Paragraph>
                        </div>

                        {error && <Alert message={error} type="error" showIcon className="login-error" />}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-item">
                                <Input
                                    prefix={<UserOutlined className="input-icon" />}
                                    type="email"
                                    placeholder="邮箱地址"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="login-input"
                                />
                            </div>

                            <div className="form-item">
                                <Input
                                    prefix={<LockOutlined className="input-icon" />}
                                    type="password"
                                    placeholder="密码"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="login-input"
                                />
                            </div>

                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-button"
                                loading={isLoading}
                                block
                            >
                                登录
                            </Button>

                            <div className="divider-container">
                                <Divider className="login-divider">
                                    <Text className="divider-text">或者使用</Text>
                                </Divider>
                            </div>

                            {/* GitHub按钮样式不变，仅功能修改 */}
                            <Button
                                className="github-login-button"
                                onClick={handleGithubLogin}
                                loading={isLoading}
                                block
                            >
                                <GithubOutlined className="github-icon" />
                                使用GitHub账号登录
                            </Button>
                        </form>
                    </Card>

                    <div className="login-helper">
                        <Space size="large" className="helper-links">
                            <Link to="/forgot-password" className="helper-link">忘记密码?</Link>
                            <Link to="/register" className="helper-link">注册新账户</Link>
                        </Space>
                    </div>
                </div>
            </Content>

            <Footer className="login-footer">
                <div className="footer-content">
                    <Text>© 2023 Bytebase. 保留所有权利。</Text>
                    <div className="footer-links">
                        <Link to="/terms" className="footer-link">服务条款</Link>
                        <Link to="/privacy" className="footer-link">隐私政策</Link>
                        <Link to="/help" className="footer-link">帮助中心</Link>
                    </div>
                </div>
            </Footer>
        </Layout>
    );
};

export default LoginPage;
