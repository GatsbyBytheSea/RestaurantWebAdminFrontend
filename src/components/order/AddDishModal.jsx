import React from 'react'
import { Modal, Button, Form, InputNumber } from 'antd'

export default function AddDishModal({ open, onCancel, onFinish, currentDish, form}) {
    return (
        <Modal
            title={currentDish ? `添加 ${currentDish.name}` : '添加菜品'}
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    name="quantity"
                    label="数量"
                    rules={[{ required: true, message: '请输入数量' }]}
                    initialValue={1}
                >
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        取消
                    </Button>
                    <Button type="primary" htmlType="submit">
                        确认
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
