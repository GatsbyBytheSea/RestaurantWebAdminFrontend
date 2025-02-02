import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'

import { adminLogin } from '../api/auth.js'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onFinish = async (values) => {
        setLoading(true)
        try {
            await adminLogin(values.username, values.password)
            message.success('登录成功')
            navigate('/')
        } catch (err) {
            message.error('登录失败或用户名密码错误')
        }
        setLoading(false)
    }

    return (
        <div style={{ width: 300, margin: '100px auto' }}>
            <h2 style={{ textAlign: 'center' }}>管理员登录</h2>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="密码" name="password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
