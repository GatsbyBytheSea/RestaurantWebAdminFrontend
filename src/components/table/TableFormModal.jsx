import React, { useEffect } from 'react'
import { Modal, Form, Input, InputNumber, Select, Button } from 'antd'

export default function TableFormModal({
                                           open,
                                           title,
                                           initialValues,
                                           onCancel,
                                           onFinish
                                       }) {
    const [form] = Form.useForm()

    useEffect(() => {
        if (open && initialValues) {
            form.setFieldsValue({
                gridX: initialValues.gridX || 0,
                gridY: initialValues.gridY || 0,
                gridWidth: initialValues.gridWidth || 1,
                gridHeight: initialValues.gridHeight || 1,
                ...initialValues
            })
        } else {
            form.resetFields()
        }
    }, [open, initialValues, form])

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            onFinish(values)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Table Name"
                    name="tableName"
                    rules={[{ required: true, message: 'Please add a table name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Capacity"
                    name="capacity"
                    rules={[{ required: true, message: 'Please confirm the table capacity' }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label="Location"
                    name="location"
                    rules={[{ required: true, message: 'Please select a table location' }]}
                >
                    <Select>
                        <Select.Option value="TERRACE">Terrace</Select.Option>
                        <Select.Option value="HALL_EAST">East Hall</Select.Option>
                        <Select.Option value="HALL_WEST">West Hall</Select.Option>
                        <Select.Option value="MAIN_HALL">Central Hall</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Please select a status' }]}
                >
                    <Select>
                        <Select.Option value="AVAILABLE">AVAILABLE</Select.Option>
                        <Select.Option value="RESERVED">RESERVED</Select.Option>
                        <Select.Option value="IN_USE">IN_USE</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="X Coordinate"
                    name="gridX"
                    rules={[{ required: true, message: 'Please provide the X coordinate' }]}
                >
                    <InputNumber disabled style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Y Coordinate"
                    name="gridY"
                    rules={[{ required: true, message: 'Please provide the Y coordinate' }]}
                >
                    <InputNumber disabled style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Table Horizontal Width"
                    name="gridWidth"
                    rules={[{ required: true, message: 'Please provide the horizontal width' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Table Vertical Height"
                    name="gridHeight"
                    rules={[{ required: true, message: 'Please provide the vertical width' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <div style={{ textAlign: 'right' }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleSubmit}>
                        Save
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}
