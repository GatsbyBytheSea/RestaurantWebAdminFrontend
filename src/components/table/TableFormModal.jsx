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
                    label="桌名"
                    name="tableName"
                    rules={[{ required: true, message: '请添加桌名' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="容量"
                    name="capacity"
                    rules={[{ required: true, message: '请确认容量' }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label="位置"
                    name="location"
                    rules={[{ required: true, message: '请选择餐桌位置' }]}
                >
                    <Select>
                        <Select.Option value="TERRACE">露台</Select.Option>
                        <Select.Option value="HALL_EAST">大厅东</Select.Option>
                        <Select.Option value="HALL_WEST">大厅西</Select.Option>
                        <Select.Option value="MAIN_HALL">中央大厅</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="状态"
                    name="status"
                    rules={[{ required: true, message: '请选择状态' }]}
                >
                    <Select>
                        <Select.Option value="AVAILABLE">AVAILABLE</Select.Option>
                        <Select.Option value="RESERVED">RESERVED</Select.Option>
                        <Select.Option value="IN_USE">IN_USE</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="X 坐标"
                    name="gridX"
                    rules={[{ required: true, message: '请提供 X 坐标' }]}
                >
                    <InputNumber disabled style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Y 坐标"
                    name="gridY"
                    rules={[{ required: true, message: '请提供 Y 坐标' }]}
                >
                    <InputNumber disabled style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="横向大小"
                    name="gridWidth"
                    rules={[{ required: true, message: '请提供横向占用格数' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="纵向大小"
                    name="gridHeight"
                    rules={[{ required: true, message: '请提供纵向占用格数' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <div style={{ textAlign: 'right' }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        取消
                    </Button>
                    <Button type="primary" onClick={handleSubmit}>
                        保存
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}
