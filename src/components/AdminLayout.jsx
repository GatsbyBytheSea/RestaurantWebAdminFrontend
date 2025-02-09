import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import {
    HomeOutlined,
    CalendarOutlined,
    TableOutlined,
    AppstoreOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons'
import { Outlet, Link } from 'react-router-dom'
import logo from '../assets/logo.png'

const { Header, Sider, Content } = Layout

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0
                }}
            >
                <div
                    style={{
                        height: 64,
                        margin: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <img
                        src={logo}
                        alt="Midnight Dinner Logo"
                        style={{
                            width: collapsed ? '70%' : '100%',
                            transition: 'width 0.2s ease'
                        }}
                    />
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                >
                    <Menu.Item key="dashboard" icon={<HomeOutlined />}>
                        <Link to="/">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="reservations" icon={<CalendarOutlined />}>
                        <Link to="/reservations">Reservations</Link>
                    </Menu.Item>
                    <Menu.Item key="tables" icon={<TableOutlined />}>
                        <Link to="/tables">Tables</Link>
                    </Menu.Item>
                    <Menu.Item key="dishes" icon={<AppstoreOutlined />}>
                        <Link to="/dishes">Menu</Link>
                    </Menu.Item>
                    <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
                        <Link to="/orders">Orders</Link>
                    </Menu.Item>
                </Menu>
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
                <Content style={{ background: '#fff' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}
