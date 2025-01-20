import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../api/auth'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onFinish = async (values) => {
        setLoading(true)
        try {
            const res = await adminLogin(values.username, values.password)
            message.success('登录成功')
            // todo: 在这里需要持久化登录状态，可以使用localStorage保存token等，需要与后端进行配合
            //  e.g. localStorage.setItem('token', res.data.token)
            navigate('/')
        } catch (err) {
            message.error(err.response?.data?.error || '登录失败')
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
