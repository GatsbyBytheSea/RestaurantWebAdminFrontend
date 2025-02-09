import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
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

    return (
        <div style={{ width: 300, margin: '100px auto' }}>
            <h2 style={{ textAlign: 'center' }}>Administrator login</h2>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Username" name="username" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
