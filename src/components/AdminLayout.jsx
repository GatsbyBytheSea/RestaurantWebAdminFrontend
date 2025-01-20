import React from 'react'
import { Layout, Menu } from 'antd'
import { Outlet, useNavigate, Link } from 'react-router-dom'

const { Header, Sider, Content } = Layout

export default function AdminLayout() {
    const navigate = useNavigate()

    // 如果需要检查是否登录，可以在这里判断 localStorage token
    // if (!localStorage.getItem('token')) { navigate('/login') }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider>
                <div style={{ color: '#fff', textAlign: 'center', padding: '16px' }}>
                    <h2 style={{ color: '#fff' }}>Midnight Dinner</h2>
                </div>
                <Menu theme="dark" mode="inline">
                    <Menu.Item key="dashboard">
                        <Link to="/">仪表盘</Link>
                    </Menu.Item>
                    <Menu.Item key="reservations">
                        <Link to="/reservations">预订管理</Link>
                    </Menu.Item>
                    <Menu.Item key="tables">
                        <Link to="/tables">餐桌管理</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', textAlign: 'right', paddingRight: '20px' }}>
                    {/* 如果需要退出:
          <Button onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>退出</Button>
          */}
                </Header>
                <Content style={{ margin: '16px' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}
