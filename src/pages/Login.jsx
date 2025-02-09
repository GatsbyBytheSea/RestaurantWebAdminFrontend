import React, { useState } from 'react'
import { Button, Form, Input, message, Card } from 'antd'
import { useNavigate } from 'react-router-dom'

import { adminLogin } from '../api/authAPi.js'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onFinish = async (values) => {
        setLoading(true)
        try {
            await adminLogin(values.username, values.password)
            message.success('Login successful')
            navigate('/')
        } catch (err) {
            message.error('Login failed or incorrect username/password')
        }
        setLoading(false)
    }

    // 外层容器样式：全屏背景图、居中对齐
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: `url("src/assets/Midnight_Dinner.webp")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    }

    // 卡片样式：半透明、圆角、可添加阴影等效果
    const cardStyle = {
        width: 350,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        padding: '20px',
    }

    return (
        <div style={containerStyle}>
            <Card style={cardStyle}>
                <h2 style={{ textAlign: 'center' }}>Administrator login</h2>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
