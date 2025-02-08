import React, { useState } from 'react'
import { Modal, Form, Input, Select, Button, Upload, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { uploadDishImage } from '../../api/dishesAPi.js'

export default function AddDishModal({
                                         visible,
                                         onCancel,
                                         onFinish,   // 父组件传进来的回调，用于提交表单后执行 createDish 等操作
                                     }) {
    const [form] = Form.useForm()
    const [fileList, setFileList] = useState([])

    const customUpload = async (options) => {
        const { file, onSuccess, onError } = options
        try {
            const res = await uploadDishImage(file)
            onSuccess(res.data, file) // antd会将res.data存入file.response
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
                            message.success('图片上传成功')
                        }
                    } else if (file.status === 'removed') {
                        form.setFieldValue('imageUrl', '')
                    } else if (file.status === 'error') {
                        message.error('图片上传失败')
                    }
                }}
            >
                {fileList.length < 1 && (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传图片</div>
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
        onCancel() // 通知父组件关闭弹窗
    }

    return (
        <Modal
            title="添加菜品"
            open={visible}
            onCancel={handleClose}
            footer={null}
            destroyOnClose
        >
            <Form layout="vertical" form={form}>
                <Form.Item label="菜名" name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="分类" name="category" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="前菜">前菜</Select.Option>
                        <Select.Option value="主菜">主菜</Select.Option>
                        <Select.Option value="甜点">甜点</Select.Option>
                        <Select.Option value="主食">主食</Select.Option>
                        <Select.Option value="酒水饮料">酒水饮料</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="价格" name="price" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item label="原材料" name="ingredients">
                    <Input placeholder="如: 花生,青菜,豆腐" />
                </Form.Item>
                <Form.Item label="描述" name="description">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item label="图片">
                    {renderUpload()}
                </Form.Item>
                <Form.Item name="imageUrl" hidden>
                    <Input />
                </Form.Item>

                <div style={{ textAlign: 'right' }}>
                    <Button style={{ marginRight: 8 }} onClick={handleClose}>
                        取消
                    </Button>
                    <Button type="primary" onClick={handleSubmit}>
                        提交
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}
