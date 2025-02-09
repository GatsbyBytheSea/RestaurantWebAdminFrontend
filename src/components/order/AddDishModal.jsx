import React from 'react'
import { Modal, Button, Form, InputNumber } from 'antd'

export default function AddDishModal({ open, onCancel, onFinish, currentDish, form}) {
    return (
        <Modal
            title={currentDish ? `Add ${currentDish.name}` : 'Add Dish'}
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true, message: 'Please enter the quantity' }]}
                    initialValue={1}
                >
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Confirm
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
