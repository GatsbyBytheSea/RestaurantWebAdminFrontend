import React, { useState } from 'react'
import { Modal, Form, Input, Select, Button, Upload, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { uploadDishImage } from '../../api/dishesAPi.js'

export default function AddDishModal({
                                         visible,
                                         onCancel,
                                         onFinish,
                                     }) {
    const [form] = Form.useForm()
    const [fileList, setFileList] = useState([])

    const customUpload = async (options) => {
        const { file, onSuccess, onError } = options
        try {
            const res = await uploadDishImage(file)
            onSuccess(res.data, file)
        } catch (err) {
            onError(err)
        }
    }

    const renderUpload = () => {
        return (
            <Upload
                customRequest={customUpload}
                listType="picture-card"
                fileList={fileList}
                maxCount={1}
                onChange={(info) => {
                    const { file, fileList } = info
                    setFileList(fileList)

                    if (file.status === 'done') {
                        if (file.response) {
                            // 把后端返回的图片URL存到表单字段
                            form.setFieldValue('imageUrl', file.response)
                            message.success('Image uploaded successfully')
                        }
                    } else if (file.status === 'removed') {
                        form.setFieldValue('imageUrl', '')
                    } else if (file.status === 'error') {
                        message.error('Image upload failed')
                    }
                }}
            >
                {fileList.length < 1 && (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload image</div>
                    </div>
                )}
            </Upload>
        )
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            await onFinish(values)
            form.resetFields()
            setFileList([])
        } catch (err) {
            console.error(err)
        }
    }

    const handleClose = () => {
        form.resetFields()
        setFileList([])
        onCancel()
    }

    return (
        <Modal
            title="Add dish"
            open={visible}
            onCancel={handleClose}
            footer={null}
            destroyOnClose
        >
            <Form layout="vertical" form={form}>
                <Form.Item label="Dish name" name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="Appetizer">Appetizer</Select.Option>
                        <Select.Option value="MainCourse">Main Course</Select.Option>
                        <Select.Option value="Dessert">Dessert</Select.Option>
                        <Select.Option value="StapleFood">Staple Food</Select.Option>
                        <Select.Option value="Beverages">Beverages</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="price" name="price" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item label="ingredients" name="ingredients">
                    <Input placeholder="E.g., peanuts, greens, fish..." />
                </Form.Item>
                <Form.Item label="description" name="description">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item label="image" name="image">
                    {renderUpload()}
                </Form.Item>
                <Form.Item name="imageUrl" hidden>
                    <Input />
                </Form.Item>

                <div style={{ textAlign: 'right' }}>
                    <Button style={{ marginRight: 8 }} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}
