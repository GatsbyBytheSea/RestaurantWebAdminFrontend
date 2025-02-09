import React from 'react'
import { Modal, Form, Select, Button } from 'antd'

export default function CreateOrderModal({ open, onCancel, onFinish, form, availableTables = []})
{
    return (
        <Modal
            title="Create new order"
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    name="tableId"
                    label="Select table"
                    rules={[{ required: true, message: 'Please select an available table' }]}
                >
                    <Select placeholder="Please select an available table">
                        {availableTables.map(t => (
                            <Select.Option key={t.id} value={t.id}>
                                {t.tableName}( Capacity: {t.capacity} )
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
