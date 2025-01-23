import React from 'react'
import {Button, Layout, Menu} from 'antd'
import { Outlet, useNavigate, Link } from 'react-router-dom'

const { Header, Sider, Content } = Layout

export default function AdminLayout() {
    const navigate = useNavigate()

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
                    <Menu.Item key="dishes">
                        <Link to="/dishes">菜品管理</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Content style={{ margin: '16px' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}
