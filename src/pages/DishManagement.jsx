import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Input, Select, message, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
    getAllDishes,
    createDish,
    updateDish,
    deleteDish,
    uploadDishImage
} from '../api/dishes'

export default function DishManagement() {
    const [dishes, setDishes] = useState([])
    const [loading, setLoading] = useState(false)

    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState({ visible: false, record: null })

    const [addForm] = Form.useForm()
    const [editForm] = Form.useForm()

    const [addFileList, setAddFileList] = useState([])
    const [editFileList, setEditFileList] = useState([])

    const fetchDishes = async () => {
        setLoading(true)
        try {
            const res = await getAllDishes()
            setDishes(res.data)
        } catch (err) {
            message.error('获取菜品列表失败')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchDishes()
    }, [])

    useEffect(() => {
        if (editModal.visible && editModal.record) {
            editForm.setFieldsValue(editModal.record)

            if (editModal.record.imageUrl) {
                setEditFileList([
                    {
                        uid: 'existing',
                        name: '已上传图片',
                        status: 'done',
                        url: editModal.record.imageUrl,
                        response: editModal.record.imageUrl // 用于后续 onChange 里统一解析
                    }
                ])
            } else {
                setEditFileList([])
            }
        } else {
            editForm.resetFields()
            setEditFileList([])
        }
    }, [editModal, editForm])

    const handleDelete = async (id) => {
        if (!window.confirm('确认删除此菜品？')) return
        try {
            await deleteDish(id)
            message.success('删除成功')
            fetchDishes()
        } catch (err) {
            message.error('删除失败')
        }
    }

    const handleAddFinish = async (values) => {
        try {
            await createDish(values)
            message.success('添加成功')
            setAddModal(false)
            // 重置表单、清空fileList
            addForm.resetFields()
            setAddFileList([])
            fetchDishes()
        } catch (err) {
            message.error('添加失败')
        }
    }

    const handleEditFinish = async (values) => {
        try {
            await updateDish(editModal.record.id, values)
            message.success('更新成功')
            setEditModal({ visible: false, record: null })
            fetchDishes()
        } catch (err) {
            message.error('更新失败')
        }
    }

    // 自定义上传函数在选文件时触发
    const customUpload = async (options) => {
        const { file, onSuccess, onError } = options
        try {
            // 调用你封装好的接口
            const res = await uploadDishImage(file)
            // 后端返回的地址 res.data
            onSuccess(res.data, file) // antd会将此值存放到 file.response
        } catch (err) {
            onError(err)
        }
    }

    // “添加菜品”时使用的 Upload 组件
    const renderAddUpload = () => {
        return (
            <Upload
                // 一旦选了文件，会自动调用 customRequest 发起上传
                customRequest={customUpload}
                listType="picture-card"
                fileList={addFileList}
                maxCount={1}
                // 当上传/删除/出错时，会触发 onChange
                onChange={(info) => {
                    const { file, fileList } = info
                    setAddFileList(fileList)

                    if (file.status === 'done') {
                        // 上传成功后, 从后端返回的file.response中获取图片地址
                        if (file.response) {
                            addForm.setFieldValue('imageUrl', file.response)
                            message.success('图片上传成功')
                        }
                    } else if (file.status === 'removed') {
                        addForm.setFieldValue('imageUrl', '')
                    } else if (file.status === 'error') {
                        message.error('图片上传失败')
                    }
                }}
            >
                {addFileList.length < 1 && (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传图片</div>
                    </div>
                )}
            </Upload>
        )
    }

    const renderEditUpload = () => {
        return (
            <Upload
                customRequest={customUpload}
                listType="picture-card"
                fileList={editFileList}
                maxCount={1}
                onChange={(info) => {
                    const { file, fileList } = info
                    setEditFileList(fileList)

                    if (file.status === 'done') {
                        if (file.response) {
                            editForm.setFieldValue('imageUrl', file.response)
                            message.success('图片上传成功')
                        }
                    } else if (file.status === 'removed') {
                        editForm.setFieldValue('imageUrl', '')
                    } else if (file.status === 'error') {
                        message.error('图片上传失败')
                    }
                }}
            >
                {editFileList.length < 1 && (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传图片</div>
                    </div>
                )}
            </Upload>
        )
    }

    return (
        <div>
            <h2>菜品管理</h2>

            <Button
                type="primary"
                onClick={() => {
                    addForm.resetFields()
                    setAddFileList([])
                    setAddModal(true)
                }}
            >
                添加菜品
            </Button>

            <div
                style={{
                    marginTop: 16,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}
            >
                {dishes.map((dish) => (
                    <div
                        key={dish.id}
                        style={{
                            width: 200,
                            height: 300,
                            backgroundImage: `url(${dish.imageUrl || ''})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: 8,
                            position: 'relative',
                            color: '#fff'
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                padding: '8px'
                            }}
                        >
                            <h4 style={{ margin: 0 }}>{dish.name}</h4>
                            <p style={{ margin: 0 }}>￥{dish.price}</p>

                            <div style={{ marginTop: 8, display: 'flex', gap: '8px' }}>
                                <Button
                                    size="small"
                                    onClick={() => setEditModal({ visible: true, record: dish })}
                                >
                                    编辑
                                </Button>
                                <Button size="small" danger onClick={() => handleDelete(dish.id)}>
                                    删除
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                title="添加菜品"
                open={addModal}
                onCancel={() => {
                    setAddModal(false)
                    addForm.resetFields()
                    setAddFileList([])
                }}
                footer={null}
            >
                <Form layout="vertical" form={addForm} onFinish={handleAddFinish}>
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

                    {/* 这里使用自动上传的 Upload */}
                    <Form.Item label="图片">
                        {renderAddUpload()}
                    </Form.Item>
                    {/* 隐藏域：存放上传后返回的 imageUrl */}
                    <Form.Item name="imageUrl" hidden>
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form>
            </Modal>

            <Modal
                title="编辑菜品"
                open={editModal.visible}
                onCancel={() => setEditModal({ visible: false, record: null })}
                footer={null}
            >
                <Form layout="vertical" form={editForm} onFinish={handleEditFinish}>
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
                        {renderEditUpload()}
                    </Form.Item>
                    <Form.Item name="imageUrl" hidden>
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}
