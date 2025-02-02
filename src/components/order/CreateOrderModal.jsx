import React from 'react'
import { Modal, Form, Select, Button } from 'antd'

export default function CreateOrderModal({ open, onCancel, onFinish, form, availableTables = []})
{
    return (
        <Modal
            title="创建新订单"
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    name="tableId"
                    label="选择餐桌"
                    rules={[{ required: true, message: '请选择可用餐桌' }]}
                >
                    <Select placeholder="请选择可用餐桌">
                        {availableTables.map(t => (
                            <Select.Option key={t.id} value={t.id}>
                                {t.tableName}（可容纳 {t.capacity} 人）
                            </Select.Option>
                        ))}
                    </Select>
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
