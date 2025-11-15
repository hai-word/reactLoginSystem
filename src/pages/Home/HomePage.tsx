import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Typography, Spin, Alert, Card, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css'; // 确保引入 antd 样式

const { Title, Paragraph, Text } = Typography;
const { Header, Content, Footer } = Layout;

const HomePage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // 用于退出登录跳转

    // 退出登录：清除 Token 并跳回登录页
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login', { replace: true });
    };

    // 加载用户信息（从后端获取）
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error('Token 不存在，请重新登录');

                // 调用后端用户信息接口（后续需要在后端实现这个接口）
                const res = await axios.get('http://localhost:3001/api/userInfo', {
                    headers: {
                        Authorization: `Bearer ${token}`, // 携带 Token 鉴权
                        'Content-Type': 'application/json'
                    }
                });
console.log(res.data);
                setData(res.data); // 存储后端返回的用户信息
            } catch (err: any) {
                // 捕获错误（如 Token 过期、接口不存在等）
                setError(err.message || '获取用户信息失败，请重试');
                console.error('用户信息请求失败：', err);
            } finally {
                setLoading(false); // 无论成功失败，都结束加载状态
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
            {/* 页头：显示标题和退出登录按钮 */}
            <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#165DFF' }}>Bytebase 首页</div>
                <Button
                    type="default"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    style={{ borderColor: '#165DFF', color: '#165DFF' }}
                >
                    退出登录
                </Button>
            </Header>

            {/* 内容区：显示加载状态/错误/用户信息 */}
            <Content style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <Card style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
                    <Title level={2} style={{ marginBottom: '24px', color: '#1D2129' }}>欢迎回来！</Title>

                    {/* 加载中状态 */}
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Spin size="large" tip="加载用户信息中..." />
                        </div>
                    )}

                    {/* 错误状态 */}
                    {error && !loading && (
                        <Alert
                            message="提示"
                            description={error}
                            type="warning"
                            showIcon
                            style={{ marginBottom: '20px' }}
                        />
                    )}

                    {/* 成功加载用户信息 */}
                    {data && !loading && !error && (
                        <div>
                            {/*显示头像*/}
                            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={data.avatarUrl}  // 从后端返回的 data 中获取头像URL
                                    alt="用户头像"
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',  // 圆形头像
                                        marginRight: '20px',
                                        border: '2px solid #f0f0f0'
                                    }}
                                />
                                <Title level={3} style={{ margin: 0 }}>欢迎回来，{data.githubUsername}！</Title>
                            </div>
                            {/*用户信息*/}
                            <Paragraph style={{ fontSize: '16px', lineHeight: 1.8 }}>
                                <Text strong>用户名：</Text> {data.githubUsername} <br />
                                <Text strong>绑定邮箱：</Text> {data.email} <br />
                                <Text strong>GitHub ID：</Text> {data.githubId} <br />
                                <Text strong>账号创建时间：</Text> {new Date(data.createdAt).toLocaleString()}
                            </Paragraph>
                        </div>
                    )}

                    {/* 无数据但无错误（兜底） */}
                    {!data && !loading && !error && (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Paragraph>暂无用户信息，可正常使用系统功能</Paragraph>
                        </div>
                    )}
                </Card>
            </Content>

            {/* 页脚 */}
            <Footer style={{ textAlign: 'center', color: '#86909C', background: 'transparent', padding: '24px' }}>
                © 2025 Bytebase.
            </Footer>
        </Layout>
    );
};

export default HomePage;
