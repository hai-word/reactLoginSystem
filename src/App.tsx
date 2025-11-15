// src/App.tsx - 应用入口组件
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd'; // 新增 AntdApp（解决 message 警告）
import LoginPage from './pages/Login';
import HomePage from './pages/Home/HomePage'; // 导入首页组件（路径对应你的文件：Home/HomePage.tsx）
import 'antd/dist/reset.css'; // 确保引入 antd 全局样式
import './App.css';

const App: React.FC = () => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#165DFF',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                },
            }}
        >
            <AntdApp> {/* 用 AntdApp 包裹，解决之前的 message 静态方法警告 */}
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} /> {/* 登录路由 */}
                        <Route path="/" element={<HomePage />} /> {/* 根路由指向首页（关键修改） */}
                    </Routes>
                </Router>
            </AntdApp>
        </ConfigProvider>
    );
};

export default App;
